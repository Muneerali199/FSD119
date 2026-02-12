'use client';

import { useState } from 'react';

export default function RecordsPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/ehr', {
      method: 'POST',
      body: JSON.stringify({
        patientId: formData.get('patientId'),
        appointmentId: formData.get('appointmentId') || undefined,
        symptoms: formData.get('symptoms'),
        diagnosis: formData.get('diagnosis'),
        treatmentPlan: formData.get('treatmentPlan'),
        notes: formData.get('notes'),
      }),
    });
    const data = await res.json();
    setStatus(res.ok ? 'Record saved securely.' : data.error ?? 'Unable to save.');
  }

  return (
    <section className="grid gap-6">
      <div className="hv-card p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Medical records</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--hv-ink)]">Electronic Health Record (EHR)</h2>
        <p className="mt-2 text-sm text-[var(--hv-sage)]">
          Doctors store structured notes and patients view their encrypted history.
        </p>
        <form onSubmit={handleRecord} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Patient ID
            <input
              name="patientId"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Appointment ID (optional)
            <input
              name="appointmentId"
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Symptoms
            <textarea
              name="symptoms"
              required
              className="mt-2 min-h-[110px] w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Diagnosis
            <textarea
              name="diagnosis"
              required
              className="mt-2 min-h-[110px] w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Treatment plan
            <textarea
              name="treatmentPlan"
              required
              className="mt-2 min-h-[110px] w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Notes
            <textarea
              name="notes"
              className="mt-2 min-h-[110px] w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-[var(--hv-forest)] px-6 py-3 text-sm font-semibold text-white"
            >
              Save encrypted record
            </button>
          </div>
        </form>
        {status && <p className="mt-4 text-sm text-[var(--hv-ember)]">{status}</p>}
      </div>

      <div className="hv-card p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Patient history</p>
        <p className="mt-3 text-sm text-[var(--hv-ink)]">
          Encrypted historical records are visible only to authorized clinicians and the patient.
        </p>
      </div>
    </section>
  );
}
