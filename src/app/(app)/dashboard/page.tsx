import { getCurrentUser, getSession } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getSession();
  const user = await getCurrentUser();
  const role = session?.role ?? 'PATIENT';

  return (
    <section className="grid gap-6">
      <div className="hv-card p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Today</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--hv-ink)]">
          {role === 'PATIENT'
            ? 'Your care plan at a glance.'
            : role === 'DOCTOR'
            ? 'Clinician queue + patient follow-ups.'
            : 'Operational pulse + compliance view.'}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Upcoming visits', value: role === 'PATIENT' ? '2' : role === 'DOCTOR' ? '8' : '32' },
            { label: 'Pending reminders', value: role === 'PATIENT' ? '1' : role === 'DOCTOR' ? '5' : '18' },
            { label: 'Records updated', value: role === 'PATIENT' ? '3' : role === 'DOCTOR' ? '12' : '64' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-[var(--hv-mist)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--hv-sage)]">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--hv-ink)]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="hv-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Next Steps</p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--hv-ink)]">
            {role === 'PATIENT' && (
              <>
                <li>Review latest prescription updates.</li>
                <li>Confirm availability for follow-up consult.</li>
                <li>Upload recent lab results for review.</li>
              </>
            )}
            {role === 'DOCTOR' && (
              <>
                <li>Check triage assistant queue for new cases.</li>
                <li>Finalize treatment plans for two pending visits.</li>
                <li>Update availability for the upcoming week.</li>
              </>
            )}
            {role === 'ADMIN' && (
              <>
                <li>Audit recent access logs for priority clinics.</li>
                <li>Review utilization metrics for rural sites.</li>
                <li>Approve new clinician onboarding requests.</li>
              </>
            )}
          </ul>
        </div>
        <div className="hv-card p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Profile snapshot</p>
          <div className="mt-4 space-y-3 text-sm text-[var(--hv-ink)]">
            <p>
              <span className="font-semibold">Name:</span> {user?.name ?? 'HealthVillage User'}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user?.email ?? session?.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {role}
            </p>
            <p>
              <span className="font-semibold">Status:</span> Active, encrypted access enabled
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
