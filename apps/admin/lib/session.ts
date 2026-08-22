/**
 * Cookie helpers for Server Actions and Route Handlers only.
 * Middleware keeps these fresh; see middleware.ts.
 */
import { cookies } from 'next/headers';
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from './session-constants';

const isProd = process.env.NODE_ENV === 'production';

export function setSessionCookies(accessToken: string, refreshToken: string) {
  const store = cookies();
  store.set(ADMIN_ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });
  store.set(ADMIN_REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookies() {
  const store = cookies();
  store.delete(ADMIN_ACCESS_TOKEN_COOKIE);
  store.delete(ADMIN_REFRESH_TOKEN_COOKIE);
}

export function getAccessToken(): string | undefined {
  return cookies().get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
}

export function getRefreshToken(): string | undefined {
  return cookies().get(ADMIN_REFRESH_TOKEN_COOKIE)?.value;
}
