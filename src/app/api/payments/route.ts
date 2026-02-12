import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/rbac';

export async function POST(request: Request) {
  const session = await getSession();
  const forbidden = requireRole(session, ['PATIENT', 'ADMIN']);
  if (forbidden) return forbidden;

  try {
    const body = await request.json();
    const appointmentId = String(body.appointmentId || '');
    const amountCents = Number(body.amountCents || 0);
    if (!appointmentId || amountCents <= 0) {
      return NextResponse.json({ error: 'Invalid payment request.' }, { status: 400 });
    }

    const payment = await db.payment.upsert({
      where: { appointmentId },
      update: {
        status: 'PAID',
        reference: `MOCK-${Date.now()}`,
      },
      create: {
        appointmentId,
        amountCents,
        status: 'PAID',
        reference: `MOCK-${Date.now()}`,
      },
    });

    return NextResponse.json({ ok: true, payment });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
