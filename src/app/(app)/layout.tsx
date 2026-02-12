import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { getCurrentUser, getSession } from '@/lib/auth';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const user = await getCurrentUser();

  return (
    <AppShell userName={user?.name ?? session?.email} role={session?.role}>
      {children}
    </AppShell>
  );
}
