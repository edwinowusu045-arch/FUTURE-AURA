"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type ChartPoint = {
  name: string;
  value: number;
  metric: string;
};

interface DashboardChartProps {
  data: ChartPoint[];
}

export function DashboardChart({ data }: DashboardChartProps) {
  return (
    <div className="mt-6 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} itemStyle={{ color: '#f8fafc' }} cursor={{ fill: 'rgba(99,102,241,0.1)' }} />
          <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#metricGradient)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
