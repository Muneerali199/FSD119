import { NextResponse } from 'next/server';
import { prescriptionSchema } from '@/lib/validators';
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
