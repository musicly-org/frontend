import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { clearSession, readSession } from '@/lib/auth-session'

export async function GET() {
  const cookieStore = await cookies()
  const session = readSession(cookieStore)

  if (!session) {
    clearSession(cookieStore)
  }

  return NextResponse.json({ session })
}
