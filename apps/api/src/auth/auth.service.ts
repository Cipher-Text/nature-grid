import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register(payload: unknown) {
    return {
      message: 'Registration contract accepted',
      payload,
    };
  }

  login(payload: unknown) {
    return {
      accessToken: 'development-access-token',
      refreshToken: 'development-refresh-token',
      payload,
    };
  }

  refresh(payload: unknown) {
    return {
      accessToken: 'development-access-token',
      payload,
    };
  }

  logout() {
    return { message: 'Logged out' };
  }

  profile() {
    return {
      id: 'development-user',
      name: 'Nature Grid User',
      role: 'citizen',
    };
  }
}

