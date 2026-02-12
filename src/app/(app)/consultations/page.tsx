'use client';

import { useState } from 'react';

export default function ConsultationsPage() {
  const [status, setStatus] = useState('');

  async function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/consultations/join', {
      method: 'POST',
      body: JSON.stringify({ roomKey: formData.get('roomKey') }),
    });
    const data = await res.json();
    setStatus(res.ok ? `Room ready. Token: ${data.token}` : data.error ?? 'Unable to join');
  }

  return (
    <section className="grid gap-6">
      <div className="hv-card p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Consultations</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--hv-ink)]">Secure real-time sessions</h2>
        <p className="mt-2 text-sm text-[var(--hv-sage)]">
          End-to-end encrypted video or audio consultations with low-bandwidth optimization.
        </p>
        <form onSubmit={handleJoin} className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr]">
          <input
            name="roomKey"
            required
            placeholder="Enter room key"
            className="w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-[var(--hv-forest)] px-6 py-3 text-sm font-semibold text-white"
          >
            Join room
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-[var(--hv-ember)]">{status}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="hv-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Low bandwidth</p>
          <p className="mt-4 text-sm text-[var(--hv-ink)]">
            Adaptive bitrate, audio-first fallback, and automatic reconnection for rural networks.
          </p>
        </div>
        <div className="hv-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Secure chat</p>
          <p className="mt-4 text-sm text-[var(--hv-ink)]">
            Encrypted text chat and file sharing with secure storage and audit trail.
          </p>
        </div>
        <div className="hv-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Queue control</p>
          <p className="mt-4 text-sm text-[var(--hv-ink)]">
            Doctors manage waiting rooms, triage priority, and follow-up scheduling in real time.
          </p>
        </div>
      </div>
    </section>
  );
}
