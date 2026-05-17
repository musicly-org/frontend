import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createSession, writeSession } from '@/lib/auth-session'
import { isBackendAuthError, registerAgainstBackend } from '@/lib/auth-api'
import type { RegisterPayload } from '@/lib/auth'

export async function POST(request: Request) {
  const payload = (await request.json()) as RegisterPayload

  try {
    const token = await registerAgainstBackend(payload)
    const session = createSession(token)

    writeSession(await cookies(), session)

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    if (isBackendAuthError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }

    return NextResponse.json({ message: 'Unable to create account right now' }, { status: 500 })
  }
}
