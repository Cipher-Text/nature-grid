import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma, ProjectStatus, RestorationCategory } from '@prisma/client';
import { RestorationService } from './restoration.service';
import type { PrismaService } from '../database/prisma.service';
import type { GamificationService } from '../gamification/gamification.service';

const CREATOR = { sub: 'u1', email: 'c@b.c', role: 'CITIZEN'  };
const OTHER   = { sub: 'u2', email: 'o@b.c', role: 'CITIZEN'  };
const ADMIN   = { sub: 'u3', email: 'a@b.c', role: 'ADMIN'    };

function mockPrisma() {
  const tx = {
    restorationProject:    { create: jest.fn() },
    restorationParticipant:{ create: jest.fn() },
    auditEvent:            { create: jest.fn().mockResolvedValue({}) },
  };
  return {
    restorationProject: {
      findUnique: jest.fn(),
      findMany:   jest.fn().mockResolvedValue([]),
      count:      jest.fn().mockResolvedValue(0),
      create:     jest.fn(),
      update:     jest.fn(),
    },
    restorationParticipant: { create: jest.fn() },
    organization: { findUnique: jest.fn() },
    district:     { findUnique: jest.fn() },
    auditEvent:   { create: jest.fn().mockResolvedValue({}) },
    $transaction: jest.fn().mockImplementation((arg: unknown) => {
      if (typeof arg === 'function') return (arg as (tx: any) => unknown)(tx);
      return Promise.all(arg as Promise<unknown>[]);
    }),
  };
}

function build() {
  const prisma = mockPrisma();
  const gamification = {
    evaluateBadges: jest.fn().mockResolvedValue(undefined),
  } as unknown as GamificationService;
  const service = new RestorationService(
    prisma as unknown as PrismaService,
    gamification,
  );
  return { service, prisma, gamification };
}

const BASE_PROJECT = {
  id: 'p1',
  title: 'Sundarbans Reforestation',
  description: 'Plant mangroves',
  category: RestorationCategory.TREE_PLANTING,
  status: ProjectStatus.PLANNED,
  organizationId: null,
  districtId: 'd1',
  startDate: null,
  endDate: null,
  impactSummary: null,
  createdById: 'u1',
  createdAt: new Date(),
  updatedAt: new Date(),
  organization: null,
  district: { id: 'd1', name: 'Khulna', division: { id: 'dv1', name: 'Khulna Division' } },
  _count: { participants: 0 },
};

describe('RestorationService', () => {
  describe('create', () => {
    it('throws BadRequestException when organizationId does not exist', async () => {
      const { service, prisma } = build();
      prisma.organization.findUnique.mockResolvedValue(null);

      await expect(
        service.create(
          { title: 'Test', category: RestorationCategory.TREE_PLANTING, organizationId: 'bad-org' } as any,
          CREATOR,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('throws ForbiddenException when caller is not creator and not ADMIN', async () => {
      const { service, prisma } = build();
      prisma.restorationProject.findUnique.mockResolvedValue(BASE_PROJECT);

      await expect(
        service.update('p1', { status: ProjectStatus.ACTIVE }, OTHER),
      ).rejects.toThrow(ForbiddenException);
    });

    it('allows creator to update their own project', async () => {
      const { service, prisma } = build();
      prisma.restorationProject.findUnique.mockResolvedValue(BASE_PROJECT);
      prisma.restorationProject.update.mockResolvedValue(BASE_PROJECT);

      await expect(
        service.update('p1', { status: ProjectStatus.ACTIVE }, CREATOR),
      ).resolves.toBeDefined();
    });

    it('allows ADMIN to update any project', async () => {
      const { service, prisma } = build();
      prisma.restorationProject.findUnique.mockResolvedValue(BASE_PROJECT);
      prisma.restorationProject.update.mockResolvedValue(BASE_PROJECT);

      await expect(
        service.update('p1', { status: ProjectStatus.ACTIVE }, ADMIN),
      ).resolves.toBeDefined();
    });
  });

  describe('join', () => {
    it('succeeds when user is not yet a participant', async () => {
      const { service, prisma } = build();
      prisma.restorationProject.findUnique.mockResolvedValue(BASE_PROJECT);
      const tx = {
        restorationParticipant: { create: jest.fn().mockResolvedValue({}) },
        auditEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      (prisma.$transaction as jest.Mock).mockImplementation((fn: Function) => fn(tx));

      await expect(service.join('p1', CREATOR)).resolves.toBeDefined();
    });

    it('is idempotent — silently succeeds if already a participant (P2002)', async () => {
      const { service, prisma } = build();
      prisma.restorationProject.findUnique.mockResolvedValue(BASE_PROJECT);

      const p2002 = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
        code: 'P2002',
        clientVersion: '5.0.0',
        meta: {},
      });
      (prisma.$transaction as jest.Mock).mockRejectedValueOnce(p2002);

      // Should not throw — idempotent join
      await expect(service.join('p1', CREATOR)).resolves.toBeDefined();
    });

    it('re-throws non-P2002 Prisma errors', async () => {
      const { service, prisma } = build();
      prisma.restorationProject.findUnique.mockResolvedValue(BASE_PROJECT);

      const p2003 = new Prisma.PrismaClientKnownRequestError('Foreign key failed', {
        code: 'P2003',
        clientVersion: '5.0.0',
        meta: {},
      });
      (prisma.$transaction as jest.Mock).mockRejectedValueOnce(p2003);

      await expect(service.join('p1', CREATOR)).rejects.toThrow(p2003);
    });

    it('enqueues badge evaluation after join', async () => {
      const { service, prisma, gamification } = build();
      prisma.restorationProject.findUnique.mockResolvedValue(BASE_PROJECT);
      const tx = {
        restorationParticipant: { create: jest.fn().mockResolvedValue({}) },
        auditEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      (prisma.$transaction as jest.Mock).mockImplementation((fn: Function) => fn(tx));

      await service.join('p1', CREATOR);
      await new Promise(process.nextTick);

      expect(gamification.evaluateBadges).toHaveBeenCalledWith('u1');
    });
  });

  describe('getById', () => {
    it('throws NotFoundException when project does not exist', async () => {
      const { service, prisma } = build();
      prisma.restorationProject.findUnique.mockResolvedValue(null);

      await expect(service.getById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
