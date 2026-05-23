'use client';

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ShieldCheck } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, companyName }),
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus(result.error || 'Registration failed.');
      } else {
        localStorage.setItem('aura_token', result.token);
        router.push('/dashboard');
      }
    } catch (error) {
      setStatus('Unable to reach authentication service.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-glow backdrop-blur-xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Team registration</p>
              <h1 className="text-3xl font-semibold">Onboard your company</h1>
            </div>
          </div>
          <p className="text-slate-400">
            Create an account and connect your organization for multi-tenant BI and secure dataset analysis.
          </p>
        </div>

        {status ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-200">{status}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-glow">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              First name
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
                className="rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-violet-400"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Last name
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
                className="rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-violet-400"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm text-slate-300">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Company name
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              required
              className="rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <ShieldCheck className="h-4 w-4 text-violet-300" />
              <span>Secure company onboarding with team-level isolation.</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-60"
            >
              {loading ? 'Registering...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
