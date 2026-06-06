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
      <body className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 antialiased">
        <Header />
        <main className="min-h-screen">
          <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
