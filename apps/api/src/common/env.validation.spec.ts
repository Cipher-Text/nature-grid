import { validateEnv } from './env.validation';

const DB = { DATABASE_URL: 'postgresql://u:p@localhost:5432/db' };

describe('validateEnv', () => {
  it('accepts a sufficiently long secret', () => {
    const config = { ...DB, JWT_SECRET: 'a'.repeat(48) };
    expect(validateEnv(config)).toBe(config);
  });

  describe('rejects an unusable JWT_SECRET', () => {
    it.each([
      ['absent', undefined],
      ['empty', ''],
      ['whitespace only', '    '],
      ['non-string', 12345],
    ])('%s', (_label, value) => {
      expect(() => validateEnv({ ...DB, JWT_SECRET: value })).toThrow(/JWT_SECRET is not set/);
    });

    // Regression: this exact literal was the hardcoded fallback in
    // auth.module.ts and jwt.strategy.ts. See docs/progress.md
    // "JWT Secret Fail-Fast".
    it.each(['dev-secret-change-in-production', 'change-me', 'changeme', 'secret'])(
      'known placeholder %s',
      (placeholder) => {
        expect(() => validateEnv({ ...DB, JWT_SECRET: placeholder })).toThrow(
          /known placeholder value/,
        );
      },
    );

    it('is case-insensitive about placeholders', () => {
      expect(() => validateEnv({ ...DB, JWT_SECRET: 'DEV-Secret-Change-In-Production' })).toThrow(
        /known placeholder value/,
      );
    });
  });

  describe('minimum length', () => {
    it('rejects 31 characters', () => {
      expect(() => validateEnv({ ...DB, JWT_SECRET: 'a'.repeat(31) })).toThrow(
        /is 31 characters; at least 32 are required/,
      );
    });

    it('accepts exactly 32', () => {
      expect(() => validateEnv({ ...DB, JWT_SECRET: 'a'.repeat(32) })).not.toThrow();
    });
  });

  it('requires DATABASE_URL', () => {
    expect(() => validateEnv({ JWT_SECRET: 'a'.repeat(48) })).toThrow(/DATABASE_URL is not set/);
  });

  it('reports every problem at once rather than the first', () => {
    try {
      validateEnv({});
      fail('expected validateEnv to throw');
    } catch (err) {
      expect((err as Error).message).toMatch(/JWT_SECRET is not set/);
      expect((err as Error).message).toMatch(/DATABASE_URL is not set/);
    }
  });

  it('points at the fix', () => {
    expect(() => validateEnv({ ...DB })).toThrow(/openssl rand -base64 48/);
  });
});
