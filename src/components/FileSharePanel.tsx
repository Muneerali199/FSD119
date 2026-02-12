'use client';

import { useState } from 'react';

export default function FileSharePanel() {
  const [status, setStatus] = useState('');

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/files', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setStatus(res.ok ? 'File uploaded securely.' : data.error ?? 'Upload failed.');
  }

  return (
    <div className="hv-card p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">File sharing</p>
      <p className="mt-2 text-sm text-[var(--hv-ink)]">
        Upload encrypted files tied to a consultation or medical record.
      </p>
      <form onSubmit={handleUpload} className="mt-4 space-y-3">
        <input
          name="consultationId"
          placeholder="Consultation ID"
          className="w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-2 text-sm"
        />
        <input
          name="ehrRecordId"
          placeholder="EHR Record ID (optional)"
          className="w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-2 text-sm"
        />
        <input
          name="patientId"
          placeholder="Patient ID"
          className="w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-2 text-sm"
        />
        <input
          name="file"
          type="file"
          required
          className="w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-[var(--hv-forest)] px-4 py-2 text-sm font-semibold text-white"
        >
          Upload
        </button>
      </form>
      {status && <p className="mt-2 text-sm text-[var(--hv-ember)]">{status}</p>}
    </div>
  );
}
