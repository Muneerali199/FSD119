import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function GET() {
  clearSessionCookie();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  return NextResponse.redirect(new URL('/', baseUrl));
}
