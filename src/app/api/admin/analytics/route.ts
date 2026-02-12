import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/rbac';

export async function GET() {
  const session = await getSession();
  const forbidden = requireRole(session, ['ADMIN']);
  if (forbidden) return forbidden;

  try {
    const [users, appointments, consultations, ehrRecords] = await Promise.all([
      db.user.count(),
      db.appointment.count(),
      db.consultation.count(),
      db.eHRRecord.count(),
    ]);

    return NextResponse.json({
      ok: true,
      users,
      appointments,
      consultations,
      ehrRecords,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
