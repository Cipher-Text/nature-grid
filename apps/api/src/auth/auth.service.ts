import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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

    const tokens = await this.issueTokens(
      { sub: user.id, email: user.email, role: user.role },
      deviceMeta,
    );
    return { user, ...tokens };
  }

  async login(dto: LoginDto, deviceMeta: DeviceMeta = {}) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
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
  async logout(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
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
