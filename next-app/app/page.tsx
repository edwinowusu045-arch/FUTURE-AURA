import Link from 'next/link';
import type { SVGProps } from 'react';
import { ArrowRight, Award, BarChart3, Briefcase, ShieldCheck, Sparkles, Users } from 'lucide-react';

const features = [
  {
    title: 'Trusted decision intelligence',
    description: 'Financial leaders use AURA to convert business data into validated forecasts and board-ready narratives.',
    icon: ChartBarIcon,
  },
  {
    title: 'Secure data room',
    description: 'Centralize files, control access, and collaborate across teams with enterprise-grade governance.',
    icon: ShieldCheck,
  },
  {
    title: 'Actionable insights',
    description: 'AI-generated analyses highlight risks, opportunities, and key growth signals instantly.',
    icon: Sparkles,
  },
  {
    title: 'Operational alignment',
    description: 'Keep executive, finance and compliance teams aligned on the same real-time business picture.',
    icon: Users,
  },
];

const metrics = [
  { value: '24%', label: 'YoY revenue accuracy' },
  { value: '98%', label: 'Decision confidence score' },
  { value: '4.8/5', label: 'Stakeholder satisfaction' },
  { value: '12h', label: 'Time to insight' },
];

const pricing = [
  {
    name: 'Starter',
    price: '$199',
    description: 'For small teams beginning to measure business performance.',
    features: ['AI forecasts', 'One data source', 'Email support'],
    icon: Award,
  },
  {
    name: 'Growth',
    price: '$499',
    description: 'Best for growing teams that need real-time metrics and collaborative reports.',
    features: ['Dataset management', 'Live insights', 'Team seats'],
    icon: Briefcase,
  },
  {
    name: 'Enterprise',
    price: '$1,299',
    description: 'For large organisations that require secure governance and premium analytics.',
    features: ['Dedicated onboarding', 'SLA support', 'Custom integrations'],
    icon: Users,
  },
];

function ChartBarIcon(props: SVGProps<SVGSVGElement>) {
  return <BarChart3 {...props} />;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">

        <section className="grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
              Corporate BI for modern teams
            </div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Investment-grade business intelligence for finance, strategy, and compliance.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                AURA brings your growth metrics and market signals into one secure platform, so decision makers can act with clarity, speed, and confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-700/20 transition hover:bg-sky-800">
                Request access
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Explore dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-lg shadow-slate-200/50">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Forecast performance</p>
                <h2 className="mt-4 text-4xl font-semibold text-slate-950">$1.32M</h2>
                <p className="mt-3 text-sm text-slate-600">Projected revenue improvement across your next business cycle.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Growth velocity</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">+24%</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Confidence score</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">92%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{metric.value}</p>
              <p className="mt-3 text-sm text-slate-500">{metric.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-lg shadow-slate-200/50">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-700">Subscription plans</p>
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Choose the plan that fits your growth stage.</h2>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                Every plan is billed per month and includes secure data ingestion, AI analysis, and enterprise-ready reporting.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                {pricing.map((plan) => {
                  const Icon = plan.icon;
                  return (
                    <article key={plan.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-100 text-sky-700">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-slate-950">{plan.name}</h3>
                      <p className="mt-3 text-sm text-slate-500">{plan.description}</p>
                      <p className="mt-6 text-4xl font-semibold text-slate-950">{plan.price}</p>
                      <p className="text-sm text-slate-500">per month, billed monthly</p>
                      <ul className="mt-6 space-y-3 text-sm text-slate-600">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-sky-700">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-2xl">
              <div className="absolute -right-10 top-8 h-24 w-24 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="absolute left-0 top-16 h-24 w-24 rounded-full bg-violet-500/15 blur-3xl" />
              <div className="relative space-y-8">
                <div className="rounded-3xl bg-slate-900/90 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Premium value</p>
                  <h3 className="mt-4 text-3xl font-semibold">Secure growth analytics</h3>
                  <p className="mt-3 text-slate-400">A visual reporting canvas for executive reviews and board-ready planning.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-sky-500/10 p-5">
                    <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Chart insights</p>
                    <div className="mt-4 h-24 rounded-3xl bg-gradient-to-br from-sky-500/10 to-cyan-500/5 p-4">
                      <div className="h-full rounded-3xl border border-sky-500/20 bg-slate-950/90 p-3">
                        <div className="flex items-end justify-between gap-1 h-full">
                          <span className="h-12 w-5 rounded-full bg-sky-400" />
                          <span className="h-20 w-5 rounded-full bg-sky-300" />
                          <span className="h-10 w-5 rounded-full bg-slate-200/40" />
                          <span className="h-16 w-5 rounded-full bg-sky-200/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-900/90 p-5">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Customer health</p>
                    <p className="mt-4 text-3xl font-semibold text-white">92%</p>
                    <p className="mt-2 text-sm text-slate-400">confidence score across monthly forecasts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-lg shadow-slate-200/50">
          <div className="grid gap-10 lg:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex gap-5 rounded-3xl border border-slate-100 bg-slate-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-100 text-sky-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
                    <p className="mt-2 text-slate-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
