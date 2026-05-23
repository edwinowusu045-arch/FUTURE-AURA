'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LogIn } from 'lucide-react';
import { API_BASE_URL, API_BASE_URL_ERROR } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@acme.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!API_BASE_URL) {
        setError(API_BASE_URL_ERROR);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Unable to log in.');
      } else {
        localStorage.setItem('aura_token', result.token);
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Unable to reach the backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16">
        <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-glow backdrop-blur-xl">
          <div className="mb-10 flex items-center gap-4">
            <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Secure access</p>
              <h1 className="text-3xl font-semibold">Sign in to AURA</h1>
            </div>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm text-slate-300">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-violet-400"
                type="email"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-violet-400"
                type="password"
                required
              />
            </label>
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Continue with AURA'}
              <LogIn className="ml-2 h-4 w-4" />
            </button>
          </form>
          <p className="mt-8 text-sm text-slate-500">Use the sample credentials above for local development.</p>
        </div>
      </div>
    </main>
  );
}
