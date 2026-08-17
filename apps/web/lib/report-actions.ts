'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { routes, type CitizenReport } from '@nature-grid/contracts';
import { apiPostAuthed, ApiError } from './api';
import { ACCESS_TOKEN_COOKIE } from './session-constants';

export async function submitReportAction(formData: FormData) {
  const accessToken = cookies().get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    redirect('/login');
  }

  const title = String(formData.get('title') ?? '');
  const category = String(formData.get('category') ?? '');
  const description = String(formData.get('description') ?? '');
  const districtId = formData.get('districtId') ? String(formData.get('districtId')) : undefined;

  try {
    await apiPostAuthed<CitizenReport>(
      routes.reports.create,
      { title, category, description, districtId },
      accessToken,
    );
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'Failed to submit report';
    redirect(`/reports?error=${encodeURIComponent(message)}`);
  }

  redirect('/reports?submitted=1');
}
