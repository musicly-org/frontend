import type { AuthSession, AuthTokenResponse } from '@/lib/auth'

const SESSION_COOKIE_NAME = 'musicly_session'

interface RequestCookieStore {
  get(name: string): { value: string } | undefined
}

interface ResponseCookieStore {
  set(
    name: string,
    value: string,
    options: {
      httpOnly: boolean
      sameSite: 'lax'
      secure: boolean
      path: string
      expires: Date
    },
  ): void
}

export function createSession(token: AuthTokenResponse): AuthSession {
  const claims = decodeJwtClaims(token.accessToken)
  const expiresAt = new Date(Date.now() + token.expiresInSeconds * 1000).toISOString()

  return {
    ...token,
    email: stringClaim(claims, 'email'),
    displayName: stringClaim(claims, 'displayName'),
    expiresAt,
  }
}

export function readSession(cookiesStore: RequestCookieStore): AuthSession | null {
  const raw = cookiesStore.get(SESSION_COOKIE_NAME)?.value

  if (!raw) {
    return null
  }

  try {
    const session = JSON.parse(raw) as AuthSession

    if (!session.accessToken || !session.expiresAt) {
      return null
    }

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export function writeSession(cookiesStore: ResponseCookieStore, session: AuthSession) {
  cookiesStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(session.expiresAt),
  })
}

export function clearSession(cookiesStore: ResponseCookieStore) {
  cookiesStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
}

function decodeJwtClaims(token: string): Record<string, unknown> {
  const [, payload] = token.split('.')

  if (!payload) {
    return {}
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const decoded = Buffer.from(padded, 'base64').toString('utf8')

    return JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return {}
  }
}

function stringClaim(claims: Record<string, unknown>, key: string): string | undefined {
  const value = claims[key]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}
