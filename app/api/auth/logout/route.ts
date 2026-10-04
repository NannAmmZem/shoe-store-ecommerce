/**
 * Logout API Route
 * Clear session cookie
 */

import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function GET() {
  await clearSessionCookie();
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'));
}
