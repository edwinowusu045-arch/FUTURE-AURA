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
    <header className="sticky top-0 z-30 bg-gradient-to-r from-sky-800 to-blue-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white shadow-sm font-semibold">A</div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white">AURA</p>
            <p className="text-xs text-sky-200">Business Intelligence</p>
          </div>
        </Link>

        <nav className="hidden flex-wrap items-center gap-6 text-sm font-medium text-sky-100 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-white/90">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/register"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-900 transition hover:opacity-90"
          >
            Request access
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
