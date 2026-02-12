import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { registerSchema } from '@/lib/validators';
import { setSessionCookie } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid registration data.' }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        patientProfile: role === 'PATIENT' ? { create: {} } : undefined,
        doctorProfile:
          role === 'DOCTOR'
            ? {
                create: {
                  specialty: 'General Medicine',
                  licenseNumber: 'TEMP-LICENSE',
                },
              }
            : undefined,
        adminProfile: role === 'ADMIN' ? { create: {} } : undefined,
      },
    });

    await setSessionCookie({ sub: user.id, role: user.role, email: user.email });

    await logAudit({
      actorId: user.id,
      action: 'LOGIN',
      resource: 'auth',
      metadata: { event: 'register' },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
