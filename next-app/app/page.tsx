import Link from 'next/link';
import { ArrowRight, Cpu, Sparkles, TrendingUp, Zap } from 'lucide-react';

const features = [
  {
    title: 'Prediction',
    description: 'Forecast revenue velocity, cash runway, and customer expansion with next-gen AI.',
    icon: TrendingUp,
  },
  {
    title: 'Analysis',
    description: 'Surface anomalies, growth drivers, and hidden risks from every dataset.',
    icon: Cpu,
  },
  {
    title: 'Solutions',
    description: 'Turn insights into action plans, recommendations, and real executional playbooks.',
    icon: Sparkles,
  },
  {
    title: 'Motivation',
    description: 'Keep stakeholders aligned with narrative-ready dashboards and confident strategy.',
    icon: Zap,
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_20%_20%,_rgba(56,189,248,0.15),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#040b1a_100%)] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-cyan-500/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16 sm:px-8 lg:px-10">
        <section className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-cyan-500/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Next-gen AI BI
            </span>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black uppercase tracking-[0.4em] text-cyan-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">AURA</span>
                <span className="h-1 w-16 rounded-full bg-gradient-to-r from-cyan-300 to-violet-500" />
              </div>
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Built for founders, operators, and investor-ready teams.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                AURA is the AI-first business intelligence platform that turns raw growth data into sharp predictions, instant analysis, and confident decisions.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_50px_rgba(56,189,248,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-cyan-400/30 px-7 py-3 text-sm font-semibold text-cyan-200 transition duration-300 hover:border-cyan-300 hover:text-white">
                Login to AURA
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/10 bg-slate-950/70 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.30)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.14),_transparent_30%)]" />
            <div className="relative space-y-6">
              <div className="rounded-3xl border border-cyan-500/10 bg-slate-900/90 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Forecast snapshot</p>
                <h2 className="mt-4 text-4xl font-semibold text-white">$1.32M</h2>
                <p className="mt-3 text-slate-400">Projected revenue after your next funding round with optimized growth levers.</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/95 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Growth velocity</p>
                    <p className="mt-2 text-2xl font-semibold text-white">+24%</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/95 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Confidence score</p>
                    <p className="mt-2 text-2xl font-semibold text-white">92%</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">AI readiness</p>
                <div className="mt-6 grid gap-4">
                  <div className="flex items-center gap-4 rounded-3xl bg-slate-950/90 p-4">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-sm text-slate-400">Predictions generated</p>
                      <p className="font-semibold text-white">421</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-3xl bg-slate-950/90 p-4">
                    <Sparkles className="h-5 w-5 text-violet-400" />
                    <div>
                      <p className="text-sm text-slate-400">Insights unlocked</p>
                      <p className="font-semibold text-white">18</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-slate-900/90">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-sky-400 opacity-80" />
                <div className="relative space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300 shadow-[0_10px_30px_rgba(56,189,248,0.12)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
