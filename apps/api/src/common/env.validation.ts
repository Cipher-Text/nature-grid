/**
 * Fail-fast validation for environment variables the API cannot safely start
 * without. Wired into `ConfigModule.forRoot({ validate })` so a misconfigured
 * deployment dies at boot with a readable message, rather than starting up and
 * signing tokens with a predictable secret.
 */

const MIN_JWT_SECRET_LENGTH = 32;

/** Placeholders that must never reach a running instance. */
const REJECTED_JWT_SECRETS = [
  'dev-secret-change-in-production',
  'change-me',
  'changeme',
  'secret',
];

const VALID_NODE_ENVS = ['development', 'production', 'test'];

export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const errors: string[] = [];

  // ── NODE_ENV ────────────────────────────────────────────────────────────────
  const nodeEnv = typeof config.NODE_ENV === 'string' ? config.NODE_ENV.trim() : '';
  if (nodeEnv && !VALID_NODE_ENVS.includes(nodeEnv)) {
    errors.push(
      `NODE_ENV "${nodeEnv}" is not valid — must be one of: ${VALID_NODE_ENVS.join(', ')}`,
    );
  }

  // ── JWT_SECRET ──────────────────────────────────────────────────────────────
  const jwtSecret = typeof config.JWT_SECRET === 'string' ? config.JWT_SECRET.trim() : '';
  if (!jwtSecret) {
    errors.push('JWT_SECRET is not set — generate one with `openssl rand -base64 48`');
  } else if (REJECTED_JWT_SECRETS.includes(jwtSecret.toLowerCase())) {
    errors.push('JWT_SECRET is a known placeholder value — generate a real one with `openssl rand -base64 48`');
  } else if (jwtSecret.length < MIN_JWT_SECRET_LENGTH) {
    errors.push(
      `JWT_SECRET is ${jwtSecret.length} characters; at least ${MIN_JWT_SECRET_LENGTH} are required`,
    );
  }

  // ── DATABASE_URL ────────────────────────────────────────────────────────────
  if (!config.DATABASE_URL) {
    errors.push('DATABASE_URL is not set');
  }

  // ── CORS_ORIGIN ─────────────────────────────────────────────────────────────
  // In production CORS_ORIGIN must be explicit. Omitting it causes the API to
  // allow all origins (origin: true), which is a CSRF/XSS risk.
  if (nodeEnv === 'production' && !config.CORS_ORIGIN) {
    errors.push(
      'CORS_ORIGIN is not set — in production this would allow all origins. ' +
        'Set it to a comma-separated list of allowed origins, e.g. "https://naturegrid.bd"',
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid environment configuration:\n${errors.map((e) => `  - ${e}`).join('\n')}\n` +
        'See .env.example for the full list of required variables.',
    );
  }

  return config;
}
