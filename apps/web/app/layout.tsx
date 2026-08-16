import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import PublicNav from '../components/public-nav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Nature Grid — Bangladesh Environmental Intelligence',
  description:
    'Public environmental board for Bangladesh. Browse active alerts, verified reports, datasets, biodiversity records, and restoration projects — no login required.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div className="public-shell">
          <PublicNav />
          {children}
        </div>
      </body>
    </html>
  );
}
