import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { ThemeToggle } from './theme-toggle';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col bg-slate-950/90 p-6 lg:p-10">
          <div className="mb-6 flex items-center justify-end">
            <ThemeToggle />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
