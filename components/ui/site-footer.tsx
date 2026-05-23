export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} AURA. Built for modern business intelligence.</p>
        <p>Secure, scalable, and designed for growth.</p>
      </div>
    </footer>
  );
}
