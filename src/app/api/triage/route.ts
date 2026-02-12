import { NextResponse } from 'next/server';
import { triageSchema } from '@/lib/validators';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { encryptText } from '@/lib/crypto';
import { requireRole } from '@/lib/rbac';

function generateRecommendation(symptoms: string) {
  const lower = symptoms.toLowerCase();
  if (lower.includes('chest pain') || lower.includes('shortness of breath')) {
    return 'Seek immediate medical attention or emergency services.';
  }
  if (lower.includes('fever') || lower.includes('cough')) {
    return 'Schedule a clinician visit within 24-48 hours and monitor vitals.';
  }
  return 'Log symptoms, rest, hydrate, and schedule a non-urgent consult if symptoms persist.';
}

export async function POST(request: Request) {
  const session = await getSession();
  const forbidden = requireRole(session, ['PATIENT']);
  if (forbidden) return forbidden;

  try {
    const body = await request.json();
    const parsed = triageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid triage data.' }, { status: 400 });
    }

    const recommendation = generateRecommendation(parsed.data.symptoms);

    const triage = await db.triageSession.create({
      data: {
        patientId: session!.sub,
        symptomsEncrypted: encryptText(parsed.data.symptoms),
        recommendationEncrypted: encryptText(recommendation),
      },
    });

    return NextResponse.json({ ok: true, recommendation, triageId: triage.id });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
