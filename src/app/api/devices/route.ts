import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { encryptText } from '@/lib/crypto';
import { requireRole } from '@/lib/rbac';

export async function POST(request: Request) {
  const session = await getSession();
  const forbidden = requireRole(session, ['PATIENT']);
  if (forbidden) return forbidden;

  try {
    const body = await request.json();
    const deviceType = String(body.deviceType || 'Wearable');
    const reading = body.reading ?? { bpm: 78, spO2: 98 };

    const record = await db.deviceReading.create({
      data: {
        patientId: session!.sub,
        deviceType,
        readingEncrypted: encryptText(JSON.stringify(reading)),
      },
    });

    return NextResponse.json({ ok: true, deviceReadingId: record.id });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
