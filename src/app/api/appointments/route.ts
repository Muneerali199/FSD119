import { NextResponse } from 'next/server';
import { appointmentSchema } from '@/lib/validators';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { scheduleReminder } from '@/lib/notifications';
import { logAudit } from '@/lib/audit';
import { requireRole } from '@/lib/rbac';

export async function POST(request: Request) {
  const session = await getSession();
  const forbidden = requireRole(session, ['PATIENT', 'ADMIN']);
  if (forbidden) return forbidden;

  try {
    const body = await request.json();
    const parsed = appointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid appointment data.' }, { status: 400 });
    }

    const { doctorId, startAt, endAt, reason, locationType } = parsed.data;
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    const appointment = await db.appointment.create({
      data: {
        patientId: session!.sub,
        doctorId,
        startAt: startDate,
        endAt: endDate,
        reason,
        locationType,
        status: 'CONFIRMED',
      },
    });

    const reminders = [
      { hours: 24, label: '24-hour reminder' },
      { minutes: 30, label: '30-minute reminder' },
    ];

    for (const reminder of reminders) {
      const scheduledAt = new Date(startDate.getTime());
      if ('hours' in reminder) {
        scheduledAt.setHours(scheduledAt.getHours() - reminder.hours);
      }
      if ('minutes' in reminder) {
        scheduledAt.setMinutes(scheduledAt.getMinutes() - reminder.minutes);
      }

      if (scheduledAt > new Date()) {
        await scheduleReminder({
          userId: session!.sub,
          title: 'Upcoming appointment',
          body: `Reminder: appointment scheduled at ${startDate.toLocaleString()}.`,
          scheduledAt,
        });
        await scheduleReminder({
          userId: doctorId,
          title: 'Upcoming appointment',
          body: `Reminder: appointment scheduled at ${startDate.toLocaleString()}.`,
          scheduledAt,
        });
      }
    }

    await logAudit({
      actorId: session!.sub,
      action: 'CREATE',
      resource: 'appointment',
      resourceId: appointment.id,
    });

    return NextResponse.json({ ok: true, appointmentId: appointment.id });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
