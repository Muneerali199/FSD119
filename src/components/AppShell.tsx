import Link from 'next/link';
import { ReactNode } from 'react';

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Scheduling', href: '/scheduling' },
  { label: 'Consultations', href: '/consultations' },
  { label: 'Medical Records', href: '/records' },
  { label: 'Prescriptions', href: '/prescriptions' },
  { label: 'Admin', href: '/admin' },
];

export default function AppShell({
  children,
  userName,
  role,
}: {
  children: ReactNode;
  userName?: string | null;
  role?: string | null;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl gap-6 px-6 py-10">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="hv-card p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--hv-forest)] text-white">
                HV
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">HealthVillage</p>
                <p className="text-sm font-semibold text-[var(--hv-ink)]">Care Workspace</p>
              </div>
            </div>
            <nav className="mt-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-[var(--hv-ink)] hover:bg-[var(--hv-mist)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          <header className="hv-card flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--hv-sage)]">Welcome back</p>
              <h1 className="text-2xl font-semibold text-[var(--hv-ink)]">
                {userName ?? 'HealthVillage User'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hv-pill bg-[var(--hv-forest)] text-white">{role ?? 'Role'}</span>
              <Link
                href="/logout"
                className="rounded-full border border-[var(--hv-forest)] px-4 py-2 text-sm font-semibold text-[var(--hv-forest)]"
              >
                Sign out
              </Link>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
