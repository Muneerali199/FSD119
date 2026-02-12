import { NextResponse } from 'next/server';
import { ehrSchema } from '@/lib/validators';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { encryptText } from '@/lib/crypto';
import { logAudit } from '@/lib/audit';
import { requireRole } from '@/lib/rbac';

export async function POST(request: Request) {
  const session = await getSession();
  const forbidden = requireRole(session, ['DOCTOR']);
  if (forbidden) return forbidden;

  try {
    const body = await request.json();
    const parsed = ehrSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid EHR data.' }, { status: 400 });
    }

    const { patientId, appointmentId, symptoms, diagnosis, treatmentPlan, notes } = parsed.data;

    const record = await db.eHRRecord.create({
      data: {
        patientId,
        doctorId: session!.sub,
        appointmentId,
        symptomsEncrypted: encryptText(symptoms),
        diagnosisEncrypted: encryptText(diagnosis),
        treatmentEncrypted: encryptText(treatmentPlan),
        notesEncrypted: notes ? encryptText(notes) : undefined,
      },
    });

    await logAudit({
      actorId: session!.sub,
      action: 'CREATE',
      resource: 'ehr',
      resourceId: record.id,
    });

    return NextResponse.json({ ok: true, recordId: record.id });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
