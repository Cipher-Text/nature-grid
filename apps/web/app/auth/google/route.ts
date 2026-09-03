/**
 * GET /auth/google
 *
 * Proxies the browser to the NestJS Google OAuth initiation endpoint.
 * Keeping the redirect server-side means API_URL stays out of the client bundle
 * — no NEXT_PUBLIC_ prefix needed.
 */
export async function GET() {
  const API_BASE_URL = process.env.API_URL ?? 'http://localhost:3001';
  return Response.redirect(`${API_BASE_URL}/api/v1/auth/google`);
}
