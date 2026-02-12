'use client';

import { useState } from 'react';

export default function PrescriptionsPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function handlePrescription(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/prescriptions', {
      method: 'POST',
      body: JSON.stringify({
        patientId: formData.get('patientId'),
        ehrRecordId: formData.get('ehrRecordId') || undefined,
        medications: formData.get('medications'),
        dosage: formData.get('dosage'),
        instructions: formData.get('instructions'),
        expiresAt: formData.get('expiresAt') || undefined,
      }),
    });
    const data = await res.json();
    setStatus(res.ok ? 'Prescription issued.' : data.error ?? 'Unable to issue.');
  }

  return (
    <section className="grid gap-6">
      <div className="hv-card p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Digital prescriptions</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--hv-ink)]">Issue, track, and follow up</h2>
        <p className="mt-2 text-sm text-[var(--hv-sage)]">
          Secure digital prescriptions with renewal and follow-up reminders.
        </p>
        <form onSubmit={handlePrescription} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Patient ID
            <input
              name="patientId"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            EHR Record ID (optional)
            <input
              name="ehrRecordId"
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Medications
            <textarea
              name="medications"
              required
              className="mt-2 min-h-[100px] w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Dosage
            <textarea
              name="dosage"
              required
              className="mt-2 min-h-[100px] w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Instructions
            <textarea
              name="instructions"
              required
              className="mt-2 min-h-[100px] w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Expiration date
            <input
              type="date"
              name="expiresAt"
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-[var(--hv-forest)] px-6 py-3 text-sm font-semibold text-white"
            >
              Issue prescription
            </button>
          </div>
        </form>
        {status && <p className="mt-4 text-sm text-[var(--hv-ember)]">{status}</p>}
      </div>

      <div className="hv-card p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Follow-up tracking</p>
        <p className="mt-3 text-sm text-[var(--hv-ink)]">
          Automated reminders keep patients on track with refills and check-ins.
        </p>
      </div>
    </section>
  );
}
