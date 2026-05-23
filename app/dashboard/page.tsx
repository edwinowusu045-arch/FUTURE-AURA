import type { Prediction } from '@prisma/client';
import { AnalyticsCard } from '@/components/ui/analytics-card';
import { DashboardChart } from '@/components/ui/dashboard-chart';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const samplePredictions = [
  { id: 'sample-1', tenantId: 'sample', metric: 'Revenue', value: 1200000, horizon: 'Annual', generatedAt: new Date() },
  { id: 'sample-2', tenantId: 'sample', metric: 'Revenue', value: 110000, horizon: 'Monthly', generatedAt: new Date() },
  { id: 'sample-3', tenantId: 'sample', metric: 'Gross Margin', value: 48.2, horizon: 'Annual', generatedAt: new Date() },
  { id: 'sample-4', tenantId: 'sample', metric: 'Customer Growth', value: 16.5, horizon: 'Monthly', generatedAt: new Date() }
] satisfies Prediction[];

const sampleInsights = [
  {
    id: 'sample-insight-1',
    tenantId: 'sample',
    title: 'Optimize customer retention',
    category: 'Growth',
    summary: 'Cash runway is strong for the next 12 months, but high churn should be addressed.',
    impact: 'High',
    createdAt: new Date()
  }
];

const getDashboardData = async () => {
  try {
    const predictions = await prisma.prediction.findMany({ orderBy: { generatedAt: 'desc' }, take: 4 });
    const insights = await prisma.insight.findMany({ orderBy: { createdAt: 'desc' }, take: 3 });
    return { predictions, insights };
  } catch (error) {
    return { predictions: samplePredictions, insights: sampleInsights };
  }
};

export default async function DashboardPage() {
  const { predictions, insights } = await getDashboardData();

  const chartData = predictions.map((prediction: Prediction) => ({
    name: prediction.horizon,
    value: prediction.value,
    metric: prediction.metric
  }));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">AURA intelligence</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Business health at a glance</h1>
          </div>
          <Link href="/" className="rounded-full border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
            Back to landing
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <AnalyticsCard title="Annual revenue" value="$1.2M" trend="+18%">
                Predictive income is stable, with revenue strength in recurring revenue streams.
              </AnalyticsCard>
              <AnalyticsCard title="Customer growth" value="16.5%" trend="+9%">
                Monthly customer acquisition is accelerating after AI-led campaign optimization.
              </AnalyticsCard>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-glow">
              <h2 className="text-lg font-semibold text-white">Forecast overview</h2>
              <p className="mt-2 text-slate-400">This predictive chart is generated from the latest financial and growth inputs.</p>
              <DashboardChart data={chartData} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-glow">
              <h2 className="text-lg font-semibold text-white">Upload your business data</h2>
              <p className="mt-3 text-slate-400">Securely ingest CSV or JSON files to start generating tailored predictions and insights.</p>
              <form action="/api/upload" method="post" encType="multipart/form-data" className="mt-6 space-y-4">
                <input
                  type="file"
                  name="file"
                  accept=".csv,application/json"
                  className="block w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 file:cursor-pointer file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:text-sm file:font-semibold"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                >
                  Upload data
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-glow">
              <h2 className="text-lg font-semibold text-white">Latest AI insights</h2>
              <div className="mt-5 space-y-4">
                {insights.map((insight) => (
                  <article key={insight.id} className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-sm font-semibold text-violet-300">{insight.category}</p>
                    <h3 className="mt-2 text-base font-semibold text-white">{insight.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{insight.summary}</p>
                    <span className="mt-3 inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{insight.impact}</span>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
