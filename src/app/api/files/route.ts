import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { encryptBuffer } from '@/lib/crypto';
import crypto from 'crypto';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');
  const consultationId = formData.get('consultationId')?.toString();
  const ehrRecordId = formData.get('ehrRecordId')?.toString();
  const patientId = formData.get('patientId')?.toString();

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'File required.' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const encrypted = encryptBuffer(buffer);
  const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

  const storageName = `${crypto.randomBytes(16).toString('hex')}.bin`;
  const storageDir = path.join(process.cwd(), 'storage');
  await fs.mkdir(storageDir, { recursive: true });
  const storagePath = path.join(storageDir, storageName);
  await fs.writeFile(storagePath, encrypted);

  const asset = await db.fileAsset.create({
    data: {
      ownerId: session.sub,
      patientId: patientId || undefined,
      consultationId: consultationId || undefined,
      ehrRecordId: ehrRecordId || undefined,
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: buffer.length,
      storagePath,
      checksum,
      isEncrypted: true,
    },
  });

  return NextResponse.json({ ok: true, fileId: asset.id });
}
