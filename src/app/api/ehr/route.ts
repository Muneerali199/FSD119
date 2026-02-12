import { NextResponse } from 'next/server';
import { ehrSchema } from '@/lib/validators';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { decryptText, encryptText } from '@/lib/crypto';
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

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  const targetPatientId = session.role === 'PATIENT' ? session.sub : patientId;
  if (!targetPatientId) {
    return NextResponse.json({ error: 'patientId required.' }, { status: 400 });
  }

  const records = await db.eHRRecord.findMany({\n    where: { patientId: targetPatientId },\n    orderBy: { createdAt: 'desc' },\n  });\n\n  return NextResponse.json({\n    ok: true,\n    records: records.map((record) => ({\n      id: record.id,\n      patientId: record.patientId,\n      doctorId: record.doctorId,\n      appointmentId: record.appointmentId,\n      createdAt: record.createdAt,\n      symptoms: decryptText(record.symptomsEncrypted),\n      diagnosis: decryptText(record.diagnosisEncrypted),\n      treatmentPlan: decryptText(record.treatmentEncrypted),\n      notes: record.notesEncrypted ? decryptText(record.notesEncrypted) : null,\n    })),\n  });\n}
