import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from './lib/session-constants';

const API_BASE_URL = process.env.API_URL ?? 'http://localhost:3001';
const isProd = process.env.NODE_ENV === 'production';

const PROTECTED_PREFIXES = ['/reports'];

function isAccessTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64)) as { exp: number };
    const EARLY_REFRESH_MS = 10_000;
    return Date.now() >= payload.exp * 1000 - EARLY_REFRESH_MS;
  } catch {
    return true;
  }
}

function cookieOptions(maxAge: number) {
  return { httpOnly: true, secure: isProd, sameSite: 'lax' as const, path: '/', maxAge };
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  const accessToken = req.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken && !isAccessTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    if (isProtected) return NextResponse.redirect(new URL('/login', req.url));
    return NextResponse.next();
  }

  // Access token missing/expired but refresh token present — rotate before rendering.
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error('refresh failed');
    const tokens = (await res.json()) as { accessToken: string; refreshToken: string };

    const response = NextResponse.next();
    response.cookies.set(
      ADMIN_ACCESS_TOKEN_COOKIE,
      tokens.accessToken,
      cookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS),
    );
    response.cookies.set(
      ADMIN_REFRESH_TOKEN_COOKIE,
      tokens.refreshToken,
      cookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS),
    );
    return response;
  } catch {
    if (isProtected) {
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete(ADMIN_ACCESS_TOKEN_COOKIE);
      response.cookies.delete(ADMIN_REFRESH_TOKEN_COOKIE);
      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
