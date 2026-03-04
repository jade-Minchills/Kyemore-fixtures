import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kylemore Sports Ground Fixtures',
  description: 'See what games are happening at Kylemore Sports Ground',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}