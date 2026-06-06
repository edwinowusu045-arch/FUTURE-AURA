import Link from 'next/link';

const footerLinks = [
  { label: 'About', href: '/register' },
  { label: 'Solutions', href: '/dashboard' },
  { label: 'Data Room', href: '/data-room' },
  { label: 'Insights', href: '/insights' },
];

const legalLinks = [
  { label: 'Privacy', href: '/register' },
  { label: 'Terms', href: '/register' },
  { label: 'Cookies', href: '/register' },
];

export function Footer() {
  return (
    <footer className="border-t border-blue-900/20 bg-blue-950 text-sky-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 text-sm sm:px-8 lg:px-10 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-base font-semibold text-white">AURA</p>
          <p className="max-w-xl text-sky-200">
            Trusted intelligence for growth, finance, and strategy teams. AURA helps you secure, analyze, and communicate business performance with confidence.
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-400">© 2026 AURA. All rights reserved.</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Explore</p>
          <div className="mt-3 space-y-2">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="block transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Legal</p>
          <div className="mt-3 space-y-2">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="block transition hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="block transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
