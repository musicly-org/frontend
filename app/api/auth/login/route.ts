import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createSession, writeSession } from '@/lib/auth-session'
import { isBackendAuthError, loginAgainstBackend } from '@/lib/auth-api'
import type { LoginPayload } from '@/lib/auth'

export async function POST(request: Request) {
  const payload = (await request.json()) as LoginPayload

  try {
    const token = await loginAgainstBackend(payload)
    const session = createSession(token)

    writeSession(await cookies(), session)

    return NextResponse.json(session)
  } catch (error) {
    if (isBackendAuthError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }

    return NextResponse.json({ message: 'Unable to sign in right now' }, { status: 500 })
  }
}
