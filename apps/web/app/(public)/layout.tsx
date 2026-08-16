import PublicNav from '../../components/public-nav';

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="public-shell">
      <PublicNav />
      {children}
    </div>
  );
}
