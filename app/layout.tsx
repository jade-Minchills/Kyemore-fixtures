import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kylemore Sports Ground Fixtures',
  description: 'See what games are happening at Kylemore Sports Ground',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kylemore',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#16a34a" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}