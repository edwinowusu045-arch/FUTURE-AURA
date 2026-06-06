import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';

export const metadata: Metadata = {
  title: 'AURA | AI Business Intelligence',
  description: 'A modern business intelligence platform for investment-grade data and AI insights.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">
        <Header />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
