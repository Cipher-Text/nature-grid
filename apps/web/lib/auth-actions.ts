'use server';

import { redirect } from 'next/navigation';
import { routes, type AuthResponse } from '@nature-grid/contracts';
import { apiPost, ApiError } from './api';
import { setSessionCookies, clearSessionCookies, getRefreshToken } from './session';

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  let tokens: AuthResponse;
  try {
    tokens = await apiPost<AuthResponse>(routes.auth.login, { email, password });
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'Login failed';
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  setSessionCookies(tokens.accessToken, tokens.refreshToken);
  redirect('/reports');
}

export async function registerAction(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const displayName = String(formData.get('displayName') ?? '');
  const password = String(formData.get('password') ?? '');

  let tokens: AuthResponse;
  try {
    tokens = await apiPost<AuthResponse>(routes.auth.register, { email, displayName, password });
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'Registration failed';
    redirect(`/register?error=${encodeURIComponent(message)}`);
  }

  setSessionCookies(tokens.accessToken, tokens.refreshToken);
  redirect('/reports');
}

export async function logoutAction() {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await apiPost(routes.auth.logout, { refreshToken });
    } catch {
      // Best-effort — clear cookies regardless so the user is logged out client-side.
    }
  }
  clearSessionCookies();
  redirect('/');
}
