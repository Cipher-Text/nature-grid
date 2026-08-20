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

export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const errors: string[] = [];

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

  if (!config.DATABASE_URL) {
    errors.push('DATABASE_URL is not set');
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid environment configuration:\n${errors.map((e) => `  - ${e}`).join('\n')}\n` +
        'See .env.example for the full list of required variables.',
    );
  }

  return config;
}
