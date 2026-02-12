import { NextResponse } from 'next/server';
import { prescriptionSchema } from '@/lib/validators';
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
    const parsed = prescriptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid prescription data.' }, { status: 400 });
    }

    const { patientId, ehrRecordId, medications, dosage, instructions, expiresAt } = parsed.data;

    const prescription = await db.prescription.create({
      data: {
        patientId,
        doctorId: session!.sub,
        ehrRecordId,
        medicationsEncrypted: encryptText(medications),
        dosageEncrypted: encryptText(dosage),
        instructionsEncrypted: encryptText(instructions),
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
    });

    await logAudit({
      actorId: session!.sub,
      action: 'CREATE',
      resource: 'prescription',
      resourceId: prescription.id,
    });

    return NextResponse.json({ ok: true, prescriptionId: prescription.id });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  const targetPatientId = session.role === 'PATIENT' ? session.sub : patientId;
  if (!targetPatientId) {
    return NextResponse.json({ error: 'patientId required.' }, { status: 400 });
  }

  const prescriptions = await db.prescription.findMany({
    where: { patientId: targetPatientId },
    orderBy: { issuedAt: 'desc' },
  });

  return NextResponse.json({
    ok: true,
    prescriptions: prescriptions.map((rx) => ({
      id: rx.id,
      doctorId: rx.doctorId,
      issuedAt: rx.issuedAt,
      expiresAt: rx.expiresAt,
      status: rx.status,
      medications: decryptText(rx.medicationsEncrypted),
      dosage: decryptText(rx.dosageEncrypted),
      instructions: decryptText(rx.instructionsEncrypted),
    })),
  });
}
