import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 shadow-glow backdrop-blur-xl sm:p-14">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Future-ready business intelligence</p>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">AURA turns your business data into a confident growth strategy.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Upload datasets, get predictive forecasts, AI-driven weaknesses, and enterprise-grade decision support instantly.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-violet-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-violet-400">
              View dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] bg-slate-900/80 p-6 shadow-2xl ring-1 ring-white/5">
          <div className="rounded-3xl border border-white/5 bg-slate-950 p-6">
            <div className="mb-6 flex items-center justify-between text-sm text-slate-400">
              <span>Forecast</span>
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-200">Live</span>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Annual revenue</p>
                <p className="mt-2 text-3xl font-semibold text-white">$1.2M</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Customer growth</p>
                <p className="mt-2 text-3xl font-semibold text-white">16.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
