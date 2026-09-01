import { getCurrentUser } from '../../lib/current-user';
import AppSidebar from '../../components/app-sidebar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <div className="app-shell">
      <AppSidebar user={user} />
      <main className="main">{children}</main>
    </div>
  );
}
