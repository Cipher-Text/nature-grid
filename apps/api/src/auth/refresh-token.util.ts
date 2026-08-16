import { randomBytes, createHash } from 'crypto';

/** Opaque refresh token — deliberately not a JWT, so it can't double as an access token. */
export function generateRefreshToken(): string {
  return randomBytes(48).toString('hex');
}

/** Never store the raw token — only its hash, same pattern as passwordHash on User. */
export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
