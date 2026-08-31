import { ConflictException, NotFoundException } from '@nestjs/common';
import { AlertSeverity, AlertStatus, DeliveryStatus, NotificationChannel } from '@prisma/client';
import { NotificationsService } from './notifications.service';
import type { PrismaService } from '../database/prisma.service';
import type { Queue } from 'bullmq';

function mockPrisma() {
  return {
    alertSubscription: {
      findFirst:  jest.fn(),
      findMany:   jest.fn().mockResolvedValue([]),
      create:     jest.fn(),
      deleteMany: jest.fn().mockResolvedValue({}),
    },
    alert: {
      findUnique: jest.fn(),
    },
    notificationDelivery: {
      create: jest.fn().mockResolvedValue({ id: 'del-1' }),
    },
    district: { findUnique: jest.fn() },
  };
}

function build() {
  const prisma = mockPrisma();
  const emailQueue = {
    add: jest.fn().mockResolvedValue({ id: 'job-1' }),
  } as unknown as Queue;
  const service = new NotificationsService(
    prisma as unknown as PrismaService,
    emailQueue,
  );
  return { service, prisma, emailQueue };
}

const BASE_ALERT = {
  id: 'alert-1',
  title: 'Flood Warning',
  severity: AlertSeverity.WARNING,
  status: AlertStatus.ACTIVE,
  description: 'Rising water levels',
  instructions: 'Move to higher ground',
  issuedAt: new Date('2026-01-01T08:00:00Z'),
  districtId: 'd1',
  district: { name: 'Sylhet' },
  areas: [] as { districtId: string | null }[],
};

const makeSubscription = (userId: string, districtId: string | null, id = `sub-${userId}`) => ({
  id,
  userId,
  channel: NotificationChannel.EMAIL,
  user: { id: userId, email: `${userId}@test.com`, displayName: userId },
});

describe('NotificationsService', () => {
  describe('subscribe', () => {
    it('throws ConflictException when a duplicate subscription exists', async () => {
      const { service, prisma } = build();
      prisma.alertSubscription.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(
        service.subscribe('u1', { channel: NotificationChannel.EMAIL }),
      ).rejects.toThrow(ConflictException);
    });

    it('creates a subscription when none exists', async () => {
      const { service, prisma } = build();
      prisma.alertSubscription.findFirst.mockResolvedValue(null);
      prisma.alertSubscription.create.mockResolvedValue({ id: 'new-sub' });

      await expect(
        service.subscribe('u1', { channel: NotificationChannel.EMAIL }),
      ).resolves.toBeDefined();
      expect(prisma.alertSubscription.create).toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('throws NotFoundException when subscription does not belong to user', async () => {
      const { service, prisma } = build();
      prisma.alertSubscription.findFirst.mockResolvedValue(null);

      await expect(service.unsubscribe('sub-1', 'u1')).rejects.toThrow(NotFoundException);
    });

    it('deletes the subscription when found', async () => {
      const { service, prisma } = build();
      prisma.alertSubscription.findFirst.mockResolvedValue({ id: 'sub-1' });

      await service.unsubscribe('sub-1', 'u1');

      expect(prisma.alertSubscription.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'sub-1', userId: 'u1' } }),
      );
    });
  });

  describe('dispatchForAlert', () => {
    async function dispatch(service: NotificationsService) {
      service.dispatchForAlert('alert-1');
      // Allow the fire-and-forget async chain to settle
      await new Promise((resolve) => setImmediate(resolve));
    }

    it('skips dispatch when alert is not ACTIVE', async () => {
      const { service, prisma, emailQueue } = build();
      prisma.alert.findUnique.mockResolvedValue({ ...BASE_ALERT, status: AlertStatus.EXPIRED });

      await dispatch(service);

      expect(emailQueue.add).not.toHaveBeenCalled();
    });

    it('skips dispatch when alert does not exist', async () => {
      const { service, prisma, emailQueue } = build();
      prisma.alert.findUnique.mockResolvedValue(null);

      await dispatch(service);

      expect(emailQueue.add).not.toHaveBeenCalled();
    });

    it('enqueues one job per unique user even with duplicate subscriptions', async () => {
      const { service, prisma, emailQueue } = build();
      prisma.alert.findUnique.mockResolvedValue(BASE_ALERT);
      // Same user has two matching subscriptions (global + district)
      prisma.alertSubscription.findMany.mockResolvedValue([
        makeSubscription('u1', null,  'sub-global'),
        makeSubscription('u1', 'd1', 'sub-district'),
      ]);
      prisma.notificationDelivery.create.mockResolvedValue({ id: 'del-1' });

      await dispatch(service);

      // Only one job despite two subscriptions
      expect(emailQueue.add).toHaveBeenCalledTimes(1);
    });

    it('enqueues one job per unique user across multiple users', async () => {
      const { service, prisma, emailQueue } = build();
      prisma.alert.findUnique.mockResolvedValue(BASE_ALERT);
      prisma.alertSubscription.findMany.mockResolvedValue([
        makeSubscription('u1', null, 'sub-1'),
        makeSubscription('u2', 'd1', 'sub-2'),
      ]);
      prisma.notificationDelivery.create.mockResolvedValue({ id: 'del-1' });

      await dispatch(service);

      expect(emailQueue.add).toHaveBeenCalledTimes(2);
    });

    it('creates a PENDING delivery record before enqueueing each job', async () => {
      const { service, prisma } = build();
      prisma.alert.findUnique.mockResolvedValue(BASE_ALERT);
      prisma.alertSubscription.findMany.mockResolvedValue([
        makeSubscription('u1', null, 'sub-1'),
      ]);
      prisma.notificationDelivery.create.mockResolvedValue({ id: 'del-1' });

      await dispatch(service);

      expect(prisma.notificationDelivery.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: DeliveryStatus.PENDING,
            alertId: 'alert-1',
          }),
        }),
      );
    });

    it('passes alert snapshot data in the queued job payload', async () => {
      const { service, prisma, emailQueue } = build();
      prisma.alert.findUnique.mockResolvedValue(BASE_ALERT);
      prisma.alertSubscription.findMany.mockResolvedValue([
        makeSubscription('u1', null, 'sub-1'),
      ]);
      prisma.notificationDelivery.create.mockResolvedValue({ id: 'del-1' });

      await dispatch(service);

      expect(emailQueue.add).toHaveBeenCalledWith(
        'alert-notification',
        expect.objectContaining({
          to: 'u1@test.com',
          alert: expect.objectContaining({ title: 'Flood Warning', severity: AlertSeverity.WARNING }),
        }),
        expect.any(Object),
      );
    });
  });
});
