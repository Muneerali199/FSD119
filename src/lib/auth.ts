import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';

const COOKIE_NAME = 'hv_session';
const SESSION_TTL_DAYS = 7;

function getSecret(): Uint8Array {
  const raw = process.env.AUTH_SECRET;
  if (!raw) {
    throw new Error('Missing AUTH_SECRET');
  }
  return new TextEncoder().encode(raw);
}

export type SessionPayload = {
  sub: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  email: string;
};

export async function createSessionToken(payload: SessionPayload) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getSecret());

  return { token, expiresAt };
}

export async function setSessionCookie(payload: SessionPayload) {
  const { token, expiresAt } = await createSessionToken(payload);
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  });
}

export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return db.user.findUnique({
    where: { id: session.sub },
    include: { patientProfile: true, doctorProfile: true, adminProfile: true },
  });
}

export function hasRole(session: SessionPayload | null, roles: SessionPayload['role'][]) {
  return !!session && roles.includes(session.role);
}
