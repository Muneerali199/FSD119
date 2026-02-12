import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { encryptText, decryptText } from '@/lib/crypto';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const consultationId = searchParams.get('consultationId');
  if (!consultationId) {
    return NextResponse.json({ error: 'consultationId required' }, { status: 400 });
  }

  const consultation = await db.consultation.findFirst({
    where: { id: consultationId, participants: { some: { id: session.sub } } },
  });
  if (!consultation) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const messages = await db.message.findMany({
    where: { consultationId },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({
    ok: true,
    messages: messages.map((message) => ({
      id: message.id,
      senderId: message.senderId,
      createdAt: message.createdAt,
      body: decryptText(message.bodyEncrypted),
    })),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const consultationId = String(body.consultationId || '');
  const messageBody = String(body.body || '');
  if (!consultationId || !messageBody) {
    return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });
  }

  const consultation = await db.consultation.findFirst({
    where: { id: consultationId, participants: { some: { id: session.sub } } },
  });
  if (!consultation) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const message = await db.message.create({
    data: {
      consultationId,
      senderId: session.sub,
      bodyEncrypted: encryptText(messageBody),
    },
  });

  return NextResponse.json({ ok: true, messageId: message.id });
}
