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

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Authenticated GET, never cached — used for user-specific data like the profile. */
export async function apiGetAuthed<T>(path: string, accessToken: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new ApiError(res.status, `API request failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

/** POST for mutations — never cached. Surfaces the backend's error message when available. */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message =
      (errorBody && typeof errorBody.message === 'string' && errorBody.message) ||
      `API request failed: ${res.status} ${path}`;
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}
