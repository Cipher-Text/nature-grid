/**
 * Server-side fetch helper for the NestJS API.
 * Only used from Server Components — never sent to the browser bundle,
 * so no NEXT_PUBLIC_ prefix is needed on the env var.
 */

const API_BASE_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function apiGet<T>(path: string, revalidateSeconds = 900): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}
