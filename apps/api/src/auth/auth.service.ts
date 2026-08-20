import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuditAction } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { generateRefreshToken, hashRefreshToken } from './refresh-token.util';

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_TTL_DAYS = 7;

export interface DeviceMeta {
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto, deviceMeta: DeviceMeta = {}) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        displayName: dto.displayName,
        passwordHash,
      },
      select: { id: true, email: true, displayName: true, role: true, createdAt: true },
    });

    await this.recordAuthEvent('USER_REGISTER', user.id, deviceMeta);

    const tokens = await this.issueTokens(
      { sub: user.id, email: user.email, role: user.role },
      deviceMeta,
    );
    return { user, ...tokens };
  }

  async login(dto: LoginDto, deviceMeta: DeviceMeta = {}) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) {
      // No userId to attribute — record the attempted address instead, so a
      // spray across many unknown accounts is still visible.
      await this.recordFailedLogin(user?.id, dto.email, deviceMeta);
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      await this.recordFailedLogin(user.id, dto.email, deviceMeta);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.recordAuthEvent('USER_LOGIN', user.id, deviceMeta);

    const tokens = await this.issueTokens(
      { sub: user.id, email: user.email, role: user.role },
      deviceMeta,
    );
    return {
      user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
      ...tokens,
    };
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, displayName: true, role: true, createdAt: true, lastLoginAt: true },
    });
  }

  /** Validates a refresh token, revokes it, and issues a brand new access+refresh pair. */
  async refresh(refreshToken: string, deviceMeta: DeviceMeta = {}) {
    const tokenRecord = await this.findValidRefreshToken(refreshToken);

    const user = await this.prisma.user.findUnique({ where: { id: tokenRecord.userId } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid refresh token');

    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.issueTokens(
      { sub: user.id, email: user.email, role: user.role },
      deviceMeta,
    );
    return {
      user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role },
      ...tokens,
    };
  }

  /** Revokes a refresh token. Idempotent — silently succeeds if already gone or revoked. */
  async logout(refreshToken: string, deviceMeta: DeviceMeta = {}) {
    const tokenHash = hashRefreshToken(refreshToken);
    // Read the owning user before revoking, so the audit event is attributable.
    const record = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    const { count } = await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    // Audit a real revocation only. Repeat logouts and unknown tokens still
    // succeed (the endpoint stays idempotent) but must not log duplicate or
    // unattributable events.
    if (record && count > 0) {
      await this.recordAuthEvent('USER_LOGOUT', record.userId, deviceMeta);
    }
  }

  /**
   * Records a rejected login. Deliberately separate from `recordAuthEvent`
   * because the user may not exist, so `userId` can be null and the attempted
   * email goes in `meta` instead. The HTTP response is an identical generic
   * 401 either way — this trail is the only place the difference is visible.
   */
  private async recordFailedLogin(
    userId: string | undefined,
    email: string,
    deviceMeta: DeviceMeta,
  ) {
    await this.prisma.auditEvent.create({
      data: {
        action: 'USER_LOGIN_FAILED',
        userId: userId ?? null,
        entityType: 'User',
        entityId: userId ?? null,
        meta: { email, reason: userId ? 'bad_password_or_inactive' : 'unknown_email' },
        ipAddress: deviceMeta.ipAddress,
      },
    });
  }

  /**
   * Writes an auth-lifecycle audit event. `deviceMeta.ipAddress` is already
   * captured for refresh-token rows, so it is recorded here too — the other
   * services leave `AuditEvent.ipAddress` null because they never have it.
   */
  private async recordAuthEvent(
    action: AuditAction,
    userId: string,
    deviceMeta: DeviceMeta,
  ) {
    await this.prisma.auditEvent.create({
      data: {
        action,
        userId,
        entityType: 'User',
        entityId: userId,
        ipAddress: deviceMeta.ipAddress,
      },
    });
  }

  private async findValidRefreshToken(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);
    const record = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!record || record.revokedAt || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return record;
  }

  private async issueTokens(payload: JwtPayload, deviceMeta: DeviceMeta) {
    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });

    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
    await this.prisma.refreshToken.create({
      data: {
        userId: payload.sub,
        tokenHash: hashRefreshToken(refreshToken),
        expiresAt,
        deviceId: deviceMeta.deviceId,
        ipAddress: deviceMeta.ipAddress,
        userAgent: deviceMeta.userAgent,
      },
    });

    return { accessToken, refreshToken };
  }
}
