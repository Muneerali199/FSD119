import { NextResponse } from 'next/server';
import { availabilitySchema } from '@/lib/validators';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/rbac';

export async function POST(request: Request) {
  const session = await getSession();
  const forbidden = requireRole(session, ['DOCTOR']);
  if (forbidden) return forbidden;

  try {
    const body = await request.json();
    const parsed = availabilitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid availability data.' }, { status: 400 });
    }

    const { dayOfWeek, startTime, endTime, timezone } = parsed.data;
    const slot = await db.doctorAvailability.create({
      data: {
        doctorId: session!.sub,
        dayOfWeek,
        startTime,
        endTime,
        timezone,
      },
    });

    return NextResponse.json({ ok: true, availabilityId: slot.id });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
