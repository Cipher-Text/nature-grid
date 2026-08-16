/**
 * Cookie names shared between `lib/session.ts` (Server Actions, uses `next/headers`)
 * and `middleware.ts` (Edge runtime, uses NextRequest/NextResponse cookie APIs).
 * Kept import-free so both can use it safely.
 */
export const ACCESS_TOKEN_COOKIE = 'ng_access_token';
export const REFRESH_TOKEN_COOKIE = 'ng_refresh_token';

export const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60; // matches the access JWT's 15m expiry
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // matches the refresh token's 7d expiry
