import Link from 'next/link';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Data Room', href: '/data-room' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Insights', href: '/insights' },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 text-sm text-slate-600 sm:px-8 lg:px-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <p className="text-base font-semibold text-slate-950">AURA</p>
          <p className="max-w-xl text-slate-600">
            Secure, enterprise-ready intelligence for growth teams and investment committees. AURA helps you surface insights, validate forecasts, and keep every stakeholder aligned.
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">© 2026 AURA. All rights reserved.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-950">Quick links</p>
            <div className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block transition hover:text-slate-950">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Contact</p>
            <p className="mt-3 text-slate-600">support@aura.ai</p>
            <p className="text-slate-600">+1 (800) 123-4567</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
