'use client';

import { useState } from 'react';

export default function SchedulingPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [availabilityStatus, setAvailabilityStatus] = useState<string | null>(null);

  async function handleBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId: formData.get('doctorId'),
        startAt: formData.get('startAt'),
        endAt: formData.get('endAt'),
        reason: formData.get('reason'),
        locationType: formData.get('locationType'),
      }),
    });
    const data = await res.json();
    setStatus(res.ok ? 'Appointment reserved.' : data.error ?? 'Booking failed.');
  }

  async function handleAvailability(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAvailabilityStatus(null);
    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dayOfWeek: Number(formData.get('dayOfWeek')),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        timezone: formData.get('timezone'),
      }),
    });
    const data = await res.json();
    setAvailabilityStatus(res.ok ? 'Availability saved.' : data.error ?? 'Unable to save.');
  }

  return (
    <section className="grid gap-6">
      <div className="hv-card p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Scheduling</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--hv-ink)]">Book a new appointment</h2>
        <p className="mt-2 text-sm text-[var(--hv-sage)]">
          View doctor availability, reserve slots, and receive automatic reminders.
        </p>
        <form onSubmit={handleBooking} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Doctor ID
            <input
              name="doctorId"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
              placeholder="cuid_123"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Visit reason
            <input
              name="reason"
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
              placeholder="Follow-up for chronic care"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Start time
            <input
              name="startAt"
              type="datetime-local"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            End time
            <input
              name="endAt"
              type="datetime-local"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Visit type
            <select
              name="locationType"
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
              defaultValue="VIDEO"
            >
              <option value="VIDEO">Video</option>
              <option value="AUDIO">Audio</option>
              <option value="IN_PERSON">In person</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-full bg-[var(--hv-forest)] px-6 py-3 text-sm font-semibold text-white"
            >
              Reserve slot
            </button>
          </div>
        </form>
        {status && <p className="mt-4 text-sm text-[var(--hv-ember)]">{status}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="hv-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Doctor availability</p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--hv-ink)]">
            <li>Mon - Wed: 09:00 - 13:00 (local clinic)</li>
            <li>Thu: 10:00 - 16:00 (regional hospital)</li>
            <li>Fri: 08:00 - 12:00 (mobile unit)</li>
          </ul>
        </div>
        <div className="hv-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Reminder flow</p>
          <p className="mt-4 text-sm text-[var(--hv-ink)]">
            Automated reminders are sent 24 hours and 30 minutes before each appointment via the
            selected channel (SMS, email, or WhatsApp).
          </p>
        </div>
      </div>

      <div className="hv-card p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Clinician schedule</p>
        <p className="mt-2 text-sm text-[var(--hv-sage)]">
          Doctors can publish available blocks and manage queue order.
        </p>
        <form onSubmit={handleAvailability} className="mt-6 grid gap-4 md:grid-cols-4">
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Day of week
            <select
              name="dayOfWeek"
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
              defaultValue="1"
            >
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
              <option value="0">Sunday</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Start
            <input
              name="startTime"
              type="time"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            End
            <input
              name="endTime"
              type="time"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--hv-ink)]">
            Timezone
            <input
              name="timezone"
              defaultValue="UTC"
              className="mt-2 w-full rounded-2xl border border-[var(--hv-mist)] bg-white px-4 py-3 text-sm"
            />
          </label>
          <div className="md:col-span-4">
            <button
              type="submit"
              className="rounded-full bg-[var(--hv-forest)] px-6 py-3 text-sm font-semibold text-white"
            >
              Save availability
            </button>
          </div>
        </form>
        {availabilityStatus && (
          <p className="mt-4 text-sm text-[var(--hv-ember)]">{availabilityStatus}</p>
        )}
      </div>
    </section>
  );
}
