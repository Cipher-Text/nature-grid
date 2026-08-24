import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService, DeviceMeta } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';
import { UpdateProfileDto } from './dto/update-profile.dto';

function deviceMetaFrom(req: Request): DeviceMeta {
  return {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.authService.register(dto, deviceMetaFrom(req));
  }

  // The brute-force surface. 5 attempts per minute per IP.
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, deviceMetaFrom(req));
  }

  // Legitimate clients refresh every ~15 minutes, so this is generous while
  // still capping token-guessing.
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    return this.authService.refresh(dto.refreshToken, deviceMetaFrom(req));
  }

  @Public()
  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    await this.authService.logout(dto.refreshToken, deviceMetaFrom(req));
    return { success: true };
  }

  @Get('profile')
  profile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(user.sub, dto);
  }
}
