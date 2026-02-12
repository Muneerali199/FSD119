import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

function getSecret() {
  const raw = process.env.AUTH_SECRET;
  if (!raw) {
    throw new Error('Missing AUTH_SECRET');
  }
  return new TextEncoder().encode(raw);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const roomKey = String(body.roomKey || '').trim();
    if (!roomKey) {
      return NextResponse.json({ error: 'Room key required.' }, { status: 400 });
    }

    const consultation = await db.consultation.findFirst({ where: { roomKey } });
    if (!consultation) {
      return NextResponse.json({ error: 'Consultation not found.' }, { status: 404 });
    }

    const token = await new SignJWT({
      sub: session.sub,
      role: session.role,
      room: consultation.roomKey,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(getSecret());

    return NextResponse.json({ ok: true, token });
  } catch (error) {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
