import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nature Grid Admin',
  description: 'Administrative console for Nature Grid.',
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

