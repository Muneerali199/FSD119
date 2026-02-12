import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getSession();
  if (session?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <section className="grid gap-6">
      <div className="hv-card p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Admin control</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--hv-ink)]">Users, audit, analytics</h2>
        <p className="mt-2 text-sm text-[var(--hv-sage)]">
          Role-based access, audit trails, and utilization metrics for rural clinics.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Active users', value: '412' },
            { label: 'Consultations this week', value: '96' },
            { label: 'Audit alerts', value: '3' },
          ].map((metric) => (
            <div key={metric.label} className="rounded-2xl bg-[var(--hv-mist)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--hv-sage)]">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--hv-ink)]">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="hv-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Audit log</p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--hv-ink)]">
            <li>Admin {session?.email} exported utilization report.</li>
            <li>Dr. K. Alvarez accessed patient EHR for scheduled visit.</li>
            <li>System flagged unusual login location for clinician.</li>
          </ul>
        </div>
        <div className="hv-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Utilization insight</p>
          <p className="mt-4 text-sm text-[var(--hv-ink)]">
            Clinics with highest demand: North Ridge, Lakeview, and Riverbend. Average wait time 12
            minutes, appointment completion rate 92%.
          </p>
        </div>
      </div>
    </section>
  );
}
