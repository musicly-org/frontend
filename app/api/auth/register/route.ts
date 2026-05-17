import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createSession, toPublicSession, writeSession } from '@/lib/auth-session'
import { isBackendAuthError, registerAgainstBackend } from '@/lib/auth-api'
import type { RegisterPayload } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as RegisterPayload
    const token = await registerAgainstBackend(payload)
    const session = createSession(token)

    writeSession(await cookies(), session)

    return NextResponse.json({ session: toPublicSession(session) }, { status: 201 })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
    }

    if (isBackendAuthError(error)) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }

    return NextResponse.json({ message: 'Unable to create account right now' }, { status: 500 })
  }
}
