import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const BASE_URL = process.env.SITE_URL || 'https://big-eosin.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: 'BIG — Business Opportunity Intelligence', template: '%s | BIG' },
  description: 'AI-powered business opportunity analysis for every city, state, and industry sector in the U.S. Get real market data, competitor intelligence, and financial projections — free.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <nav style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="/" style={{ fontWeight: 700, fontSize: '18px', color: '#6366f1', textDecoration: 'none' }}>BIG</a>
          <a href="/opportunity/california" style={{ fontSize: '14px', color: '#374151', textDecoration: 'none' }}>Explore</a>
          <a href={process.env.NEXT_PUBLIC_APP_URL || '/'} style={{ fontSize: '14px', color: '#374151', textDecoration: 'none' }}>Dashboard</a>
        </nav>
        <main>{children}</main>
        <footer style={{ padding: '32px 24px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '13px', color: '#9ca3af' }}>
          © {new Date().getFullYear()} BIG — Business Opportunity Intelligence
        </footer>
      </body>
    </html>
  );
}
