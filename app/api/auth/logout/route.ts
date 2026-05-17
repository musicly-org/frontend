import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth-session'

export async function POST() {
  clearSession(await cookies())
  return NextResponse.json({ ok: true })
}
