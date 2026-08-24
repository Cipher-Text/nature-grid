import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../lib/current-user';
import PublicNav from '../../components/public-nav';

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (user) redirect('/reports');

  return (
    <div className="public-shell">
      <PublicNav />
      {children}
    </div>
  );
}
