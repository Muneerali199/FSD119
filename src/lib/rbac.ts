import { NextResponse } from 'next/server';
import type { SessionPayload } from './auth';

export function requireRole(session: SessionPayload | null, roles: SessionPayload['role'][]) {
  if (!session || !roles.includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}
