'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { apiDelete, apiPatch, apiPost, ApiError } from './api';
import { ADMIN_ACCESS_TOKEN_COOKIE } from './session-constants';

function tokenOrRedirect() {
  const token = cookies().get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  if (!token) redirect('/login');
  return token;
}

function errorMessage(err: unknown) {
  return err instanceof ApiError ? err.message : 'Organization update failed';
}

export async function createOrganizationAction(formData: FormData) {
  const token = tokenOrRedirect();
  try {
    await apiPost('/api/v1/admin/organizations', {
      name: String(formData.get('name') ?? ''),
      type: String(formData.get('type') ?? 'OTHER'),
      description: String(formData.get('description') ?? '') || undefined,
      website: String(formData.get('website') ?? '') || undefined,
    }, token);
  } catch (err) {
    redirect(`/organizations?error=${encodeURIComponent(errorMessage(err))}`);
  }
  revalidatePath('/organizations');
  redirect('/organizations?success=created');
}

export async function upsertMembershipAction(formData: FormData) {
  const token = tokenOrRedirect();
  const organizationId = String(formData.get('organizationId') ?? '');
  try {
    await apiPost(`/api/v1/admin/organizations/${organizationId}/members`, {
      userId: String(formData.get('userId') ?? ''),
      role: String(formData.get('role') ?? 'MEMBER'),
    }, token);
  } catch (err) {
    redirect(`/organizations?error=${encodeURIComponent(errorMessage(err))}`);
  }
  revalidatePath('/organizations');
  redirect('/organizations?success=member');
}

export async function updateMembershipAction(formData: FormData) {
  const token = tokenOrRedirect();
  const organizationId = String(formData.get('organizationId') ?? '');
  const userId = String(formData.get('userId') ?? '');
  try {
    await apiPatch(`/api/v1/admin/organizations/${organizationId}/members/${userId}`, {
      role: String(formData.get('role') ?? 'MEMBER'),
    }, token);
  } catch (err) {
    redirect(`/organizations?error=${encodeURIComponent(errorMessage(err))}`);
  }
  revalidatePath('/organizations');
  redirect('/organizations?success=member');
}

export async function removeMembershipAction(formData: FormData) {
  const token = tokenOrRedirect();
  const organizationId = String(formData.get('organizationId') ?? '');
  const userId = String(formData.get('userId') ?? '');
  try {
    await apiDelete(`/api/v1/admin/organizations/${organizationId}/members/${userId}`, token);
  } catch (err) {
    redirect(`/organizations?error=${encodeURIComponent(errorMessage(err))}`);
  }
  revalidatePath('/organizations');
  redirect('/organizations?success=removed');
}
