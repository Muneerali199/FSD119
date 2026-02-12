export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[var(--hv-forest)] text-white grid place-items-center text-lg font-semibold">
            HV
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--hv-sage)]">HealthVillage</p>
            <p className="text-lg font-semibold text-[var(--hv-ink)]">Rural Telemedicine Platform</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <a className="text-sm font-semibold text-[var(--hv-ink)]" href="/login">
            Sign in
          </a>
          <a
            className="rounded-full bg-[var(--hv-forest)] px-5 py-2 text-sm font-semibold text-white"
            href="/register"
          >
            Get Started
          </a>
        </div>
      </header>

      <section className="mx-auto mt-12 grid w-full max-w-6xl gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="hv-card p-8 md:p-10">
          <span className="hv-pill bg-[var(--hv-mist)] text-[var(--hv-forest)]">
            Built for low bandwidth
          </span>
          <h1 className="mt-6 text-4xl font-semibold text-[var(--hv-ink)] md:text-5xl">
            Care that travels well — from village clinics to regional hospitals.
          </h1>
          <p className="mt-4 text-base text-[var(--hv-sage)] md:text-lg">
            HealthVillage unifies scheduling, secure consultations, and electronic health records in
            one streamlined workspace. Patients can book care, doctors can manage queues, and admins
            get clear utilization insights without extra complexity.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              className="rounded-full bg-[var(--hv-forest)] px-6 py-3 text-sm font-semibold text-white"
              href="/register"
            >
              Create an account
            </a>
            <a
              className="rounded-full border border-[var(--hv-forest)] px-6 py-3 text-sm font-semibold text-[var(--hv-forest)]"
              href="/dashboard"
            >
              View the workspace
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="hv-card p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Why it works</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--hv-ink)]">
              <p>Encrypted records, prescriptions, and consults from end to end.</p>
              <p>Clear separation of scheduling, consultations, and medical history.</p>
              <p>Real-time video or audio consults optimized for unstable networks.</p>
              <p>Admin analytics, audit trails, and compliance-ready access logs.</p>
            </div>
          </div>
          <div className="hv-card p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Care metrics</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-[var(--hv-ink)]">
              <div>
                <p className="text-3xl font-semibold">98%</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--hv-sage)]">Follow-up rate</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">2.4x</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--hv-sage)]">Capacity gain</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">45%</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--hv-sage)]">Fewer missed visits</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">24/7</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--hv-sage)]">Coverage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 grid w-full max-w-6xl gap-6 md:grid-cols-3">
        {[
          {
            title: 'Patients',
            copy:
              'Book appointments, access records, and join consultations on any device with simple, guided steps.',
            tone: 'bg-[var(--hv-mist)] text-[var(--hv-forest)]',
          },
          {
            title: 'Clinicians',
            copy:
              'Manage queues, update EHR notes, issue digital prescriptions, and follow up efficiently.',
            tone: 'bg-[var(--hv-sky)] text-[var(--hv-forest)]',
          },
          {
            title: 'Administrators',
            copy:
              'Monitor utilization, audit access, and keep data secure with role-based controls.',
            tone: 'bg-[var(--hv-cream)] text-[var(--hv-forest)]',
          },
        ].map((card) => (
          <div key={card.title} className="hv-card p-6">
            <span className={`hv-pill ${card.tone}`}>{card.title}</span>
            <p className="mt-4 text-base font-semibold text-[var(--hv-ink)]">{card.title} workspace</p>
            <p className="mt-2 text-sm text-[var(--hv-sage)]">{card.copy}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl">
        <div className="hv-card p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Security posture</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--hv-ink)]">
                Built to protect sensitive care data at every step.
              </h2>
            </div>
            <a
              className="rounded-full bg-[var(--hv-ember)] px-5 py-2 text-sm font-semibold text-white"
              href="/register"
            >
              Launch secure access
            </a>
          </div>
          <div className="hv-divider my-6" />
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-[var(--hv-ink)]">Encrypted everywhere</p>
              <p className="mt-2 text-sm text-[var(--hv-sage)]">
                Field-level encryption for medical data plus TLS in transit.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--hv-ink)]">Role-based access</p>
              <p className="mt-2 text-sm text-[var(--hv-sage)]">
                Patients see their own records, clinicians see assigned cases, admins audit activity.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--hv-ink)]">Audit-ready</p>
              <p className="mt-2 text-sm text-[var(--hv-sage)]">
                Immutable access logs, configurable retention, and export-ready reporting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
