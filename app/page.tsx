import Link from 'next/link';
import { ArrowRight, CloudCog, ShieldCheck, TrendingUp } from 'lucide-react';
import { HeroSection } from '@/components/ui/hero-section';
import { SiteFooter } from '@/components/ui/site-footer';

const features = [
  {
    title: 'AI-driven predictions',
    description: 'Forecast revenue, cash flow, and customer growth automatically from your uploaded business data.',
    icon: TrendingUp
  },
  {
    title: 'Actionable insights',
    description: 'Receive strengths, weaknesses, loopholes, and concrete next steps tailored to your business.',
    icon: ShieldCheck
  },
  {
    title: 'Secure file ingestion',
    description: 'Upload CSV and JSON business data through a protected ingestion pipeline with validations.',
    icon: CloudCog
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-hero-gradient pb-24 pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <HeroSection />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-glow backdrop-blur-xl">
              <feature.icon className="h-10 w-10 text-violet-400" />
              <h3 className="mt-6 text-2xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-4 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/70 py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-8 sm:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Launch your first AI roadmap</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">From data upload to confident business decisions in minutes.</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400">
                  Explore the platform
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
