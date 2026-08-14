import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nature Grid',
  description: 'Environmental data, biodiversity, reports, and alerts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

