'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Unable to sign in');
      setIsLoading(false);
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-md hv-card p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Welcome back</p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--hv-ink)]">Sign in to HealthVillage</h1>
        <p className="mt-2 text-sm text-[var(--hv-sage)]">
          Securely access your rural telemedicine workspace.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Password
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          {error && <p className="text-sm text-[var(--hv-ember)]">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[var(--hv-forest)] px-6 py-3 text-sm font-semibold text-white"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-sm text-[var(--hv-sage)]">
          New here?{' '}
          <Link className="font-semibold text-[var(--hv-forest)]" href="/register">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
