'use client';

import { useState } from 'react';

export default function RecordsPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyStatus, setHistoryStatus] = useState<string | null>(null);

  async function handleRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/ehr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  async function loadHistory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHistoryStatus(null);
    const formData = new FormData(event.currentTarget);
    const patientId = formData.get('patientId')?.toString();
    const url = patientId ? `/api/ehr?patientId=${patientId}` : '/api/ehr';
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      setHistoryStatus(data.error ?? 'Unable to load history.');
      return;
    }
    setHistory(data.records ?? []);
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
        <form onSubmit={loadHistory} className="mt-4 flex flex-wrap gap-3">
          <input
            name="patientId"
            placeholder="Patient ID (optional for doctors)"
            className="flex-1 rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full border border-[var(--hv-forest)] px-4 py-2 text-sm font-semibold text-[var(--hv-forest)]"
          >
            Load history
          </button>
        </form>
        {historyStatus && <p className="mt-2 text-sm text-[var(--hv-ember)]">{historyStatus}</p>}
        <div className="mt-4 space-y-3 text-sm text-[var(--hv-ink)]">
          {history.length === 0 && <p className="text-[var(--hv-sage)]">No records loaded.</p>}
          {history.map((record) => (
            <div key={record.id} className="rounded-2xl bg-[var(--hv-mist)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--hv-sage)]">
                {new Date(record.createdAt).toLocaleString()}
              </p>
              <p className="mt-2"><span className="font-semibold">Symptoms:</span> {record.symptoms}</p>
              <p><span className="font-semibold">Diagnosis:</span> {record.diagnosis}</p>
              <p><span className="font-semibold">Plan:</span> {record.treatmentPlan}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
