import { generateRefreshToken, hashRefreshToken } from './refresh-token.util';

describe('refresh token utilities', () => {
  describe('generateRefreshToken', () => {
    it('returns 48 bytes as hex', () => {
      expect(generateRefreshToken()).toHaveLength(96);
      expect(generateRefreshToken()).toMatch(/^[0-9a-f]{96}$/);
    });

    it('does not repeat across calls', () => {
      const tokens = new Set(Array.from({ length: 200 }, () => generateRefreshToken()));
      expect(tokens.size).toBe(200);
    });

    // Regression: the original implementation signed refresh tokens as JWTs
    // using the same secret as access tokens, so a refresh token could be sent
    // as a Bearer token and accepted as an access token. An opaque random
    // string can only ever be redeemed via POST /auth/refresh.
    // See docs/progress.md "Auth Refresh/Logout".
    it('is opaque, not a JWT', () => {
      const token = generateRefreshToken();
      expect(token).not.toContain('.');
      expect(token.split('.')).toHaveLength(1);
      expect(() => JSON.parse(Buffer.from(token.slice(0, 32), 'base64').toString())).toThrow();
    });
  });

  describe('hashRefreshToken', () => {
    it('produces a sha256 hex digest', () => {
      expect(hashRefreshToken('abc')).toMatch(/^[0-9a-f]{64}$/);
    });

    it('is deterministic for the same input', () => {
      const token = generateRefreshToken();
      expect(hashRefreshToken(token)).toBe(hashRefreshToken(token));
    });

    it('never returns the raw token', () => {
      const token = generateRefreshToken();
      expect(hashRefreshToken(token)).not.toBe(token);
      expect(hashRefreshToken(token)).not.toContain(token);
    });

    it('separates distinct tokens', () => {
      expect(hashRefreshToken(generateRefreshToken())).not.toBe(
        hashRefreshToken(generateRefreshToken()),
      );
    });
  });
});
