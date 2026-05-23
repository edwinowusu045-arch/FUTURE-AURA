import Link from 'next/link';
import { Home, Lock, PieChart, Sparkles } from 'lucide-react';

const items = [
  { label: 'Overview', href: '/dashboard', icon: PieChart },
  { label: 'Login', href: '/login', icon: Lock },
  { label: 'Home', href: '/', icon: Home },
  { label: 'Docs', href: 'http://localhost:4000/api/docs', icon: Sparkles, external: true }
];

export function Sidebar() {
  return (
    <aside className="flex min-h-screen flex-col border-r border-white/10 bg-slate-950/95 p-6 xl:px-8">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
          A
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Future Aura</p>
          <p className="text-sm text-slate-300">BI workspace</p>
        </div>
      </div>
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-violet-400 hover:bg-slate-900"
            >
              <Icon className="h-4 w-4 text-violet-300" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
