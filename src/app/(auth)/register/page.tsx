'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Unable to register');
      setIsLoading(false);
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto w-full max-w-lg hv-card p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Get started</p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--hv-ink)]">Create your HealthVillage account</h1>
        <p className="mt-2 text-sm text-[var(--hv-sage)]">
          Secure, role-based access for patients, clinicians, and administrators.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Full name
            <input
              name="name"
              type="text"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
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
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Role
            <select
              name="role"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
              defaultValue="PATIENT"
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </label>
          {error && <p className="text-sm text-[var(--hv-ember)]">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[var(--hv-forest)] px-6 py-3 text-sm font-semibold text-white"
          >
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-sm text-[var(--hv-sage)]">
          Already have an account?{' '}
          <Link className="font-semibold text-[var(--hv-forest)]" href="/login">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
