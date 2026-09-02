import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Login with a seed dev-user account (all share the default seed password).
 * Returns both tokens so callers can test refresh / logout flows too.
 */
export async function loginAs(
  app: INestApplication,
  email: string,
  password = 'NatureGrid123!',
): Promise<TokenPair> {
  const res = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password })
    .expect(200);

  return {
    accessToken: res.body.accessToken as string,
    refreshToken: res.body.refreshToken as string,
  };
}

/** Returns an Authorization header object for use with supertest's `.set()`. */
export function bearer(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}
