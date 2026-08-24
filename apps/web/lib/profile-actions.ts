'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { apiPatchAuthed, ApiError } from './api';
import { ACCESS_TOKEN_COOKIE } from './session-constants';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(formData: FormData) {
  const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) redirect('/login');

  const socialLinks: Record<string, string> = {};
  for (const platform of ['googleScholar', 'researchGate', 'orcid', 'linkedin', 'website', 'github', 'facebook']) {
    socialLinks[platform] = String(formData.get(platform) ?? '');
  }

  try {
    await apiPatchAuthed('/api/v1/auth/profile', {
      displayName: String(formData.get('displayName') ?? ''),
      phone: String(formData.get('phone') ?? '') || undefined,
      occupation: String(formData.get('occupation') ?? '') || undefined,
      bio: String(formData.get('bio') ?? '') || undefined,
      education: String(formData.get('education') ?? '') || undefined,
      institution: String(formData.get('institution') ?? '') || undefined,
      locationDistrict: String(formData.get('locationDistrict') ?? '') || undefined,
      expertise: String(formData.get('expertise') ?? '').split(',').map((value) => value.trim()).filter(Boolean),
      researchInterests: String(formData.get('researchInterests') ?? '').split(',').map((value) => value.trim()).filter(Boolean),
      profileVisibility: String(formData.get('profileVisibility') ?? 'PUBLIC'),
      contactVisibility: String(formData.get('contactVisibility') ?? 'PRIVATE'),
      linksVisibility: String(formData.get('linksVisibility') ?? 'PUBLIC'),
      socialLinks,
    }, token);
  } catch (error) {
    const message = error instanceof ApiError ? error.message : 'Profile update failed';
    redirect(`/profile?profileError=${encodeURIComponent(message)}`);
  }

  revalidatePath('/profile');
  redirect('/profile?profileSaved=1');
}
