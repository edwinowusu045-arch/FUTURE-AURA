import { ReactNode } from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  trend: string;
  children: ReactNode;
}

export function AnalyticsCard({ title, value, trend, children }: AnalyticsCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">{title}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">{trend}</span>
      </div>
      <div className="mt-6 text-slate-400">{children}</div>
    </div>
  );
}
