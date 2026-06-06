import Link from 'next/link';

const navItems = [
  { label: 'Solutions', href: '/dashboard' },
  { label: 'Data Room', href: '/data-room' },
  { label: 'Insights', href: '/insights' },
  { label: 'Resources', href: '/register' },
  { label: 'Contact', href: '/login' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3 text-slate-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">A</div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-950">AURA</p>
            <p className="text-xs text-slate-500">Business Intelligence</p>
          </div>
        </Link>

        <nav className="hidden flex-wrap items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/register"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Request access
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
