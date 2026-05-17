import type { AuthSession, AuthTokenResponse, PublicAuthSession } from '@/lib/auth'

const SESSION_COOKIE_NAME = 'musicly_session'

type StoredAuthSession = {
  a?: string
  e?: string
  accessToken?: string
  expiresAt?: string
}

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
  const expiresAt = new Date(Date.now() + token.expiresInSeconds * 1000).toISOString()
  return buildSession(token.accessToken, expiresAt)
}

export function readSession(cookiesStore: RequestCookieStore): AuthSession | null {
  const raw = cookiesStore.get(SESSION_COOKIE_NAME)?.value

  if (!raw) {
    return null
  }

  try {
    const stored = JSON.parse(raw) as StoredAuthSession
    const accessToken = stored.a ?? stored.accessToken
    const expiresAt = stored.e ?? stored.expiresAt

    if (!accessToken || !expiresAt) {
      return null
    }

    if (new Date(expiresAt).getTime() <= Date.now()) {
      return null
    }

    return buildSession(accessToken, expiresAt)
  } catch {
    return null
  }
}

export function writeSession(cookiesStore: ResponseCookieStore, session: AuthSession) {
  cookiesStore.set(SESSION_COOKIE_NAME, JSON.stringify({ a: session.accessToken, e: session.expiresAt }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(session.expiresAt),
  })
}

export function toPublicSession(session: AuthSession): PublicAuthSession {
  return {
    email: session.email,
    displayName: session.displayName,
    expiresAt: session.expiresAt,
    roles: session.roles,
    permissions: session.permissions,
  }
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

function stringArrayClaim(claims: Record<string, unknown>, key: string): string[] {
  const value = claims[key]

  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string' && item.length > 0)
}

function buildSession(accessToken: string, expiresAt: string): AuthSession {
  const claims = decodeJwtClaims(accessToken)

  return {
    accessToken,
    email: stringClaim(claims, 'email'),
    displayName: stringClaim(claims, 'displayName'),
    expiresAt,
    roles: stringArrayClaim(claims, 'roles'),
    permissions: stringArrayClaim(claims, 'permissions'),
  }
}
