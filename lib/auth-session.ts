import { createHmac, timingSafeEqual } from 'node:crypto'
import type { AuthSession, AuthTokenResponse, PublicAuthSession } from '@/lib/auth'

const SESSION_COOKIE_NAME = 'musicly_session'

type StoredAuthSession = {
  a?: string
  e?: string
  r?: string[]
  p?: string[]
  accessToken?: string
  expiresAt?: string
  roles?: string[]
  permissions?: string[]
}

type StoredAuthSessionEnvelope = {
  d: StoredAuthSession
  s: string
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
  return buildSession(token.accessToken, expiresAt, token.roles, token.permissions)
}

export function readSession(cookiesStore: RequestCookieStore): AuthSession | null {
  const raw = cookiesStore.get(SESSION_COOKIE_NAME)?.value

  if (!raw) {
    return null
  }

  try {
    const envelope = JSON.parse(raw) as StoredAuthSessionEnvelope
    const stored = verifyStoredSessionEnvelope(envelope)

    if (!stored) {
      return null
    }

    const accessToken = stored.a ?? stored.accessToken
    const expiresAt = stored.e ?? stored.expiresAt
    const roles = stored.r ?? stored.roles
    const permissions = stored.p ?? stored.permissions

    if (!accessToken || !expiresAt) {
      return null
    }

    const expiresAtMs = new Date(expiresAt).getTime()

    if (Number.isNaN(expiresAtMs) || expiresAtMs <= Date.now()) {
      return null
    }

    return buildSession(accessToken, expiresAt, roles, permissions)
  } catch {
    return null
  }
}

export function writeSession(cookiesStore: ResponseCookieStore, session: AuthSession) {
  const stored: StoredAuthSession = {
    a: session.accessToken,
    e: session.expiresAt,
    r: session.roles,
    p: session.permissions,
  }

  cookiesStore.set(SESSION_COOKIE_NAME, JSON.stringify(signStoredSession(stored)), {
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

function buildSession(
  accessToken: string,
  expiresAt: string,
  rolesFromSource?: string[],
  permissionsFromSource?: string[],
): AuthSession {
  const claims = decodeJwtClaims(accessToken)
  const rolesFromClaims = stringArrayClaim(claims, 'roles')
  const permissionsFromClaims = stringArrayClaim(claims, 'permissions')

  return {
    accessToken,
    email: stringClaim(claims, 'email'),
    displayName: stringClaim(claims, 'displayName'),
    expiresAt,
    roles: rolesFromSource && rolesFromSource.length > 0 ? rolesFromSource : rolesFromClaims,
    permissions:
      permissionsFromSource && permissionsFromSource.length > 0 ? permissionsFromSource : permissionsFromClaims,
  }
}

function signStoredSession(stored: StoredAuthSession): StoredAuthSessionEnvelope {
  const secret = getSessionCookieSecret()
  const payload = stableSessionPayload(stored)

  return {
    d: stored,
    s: createHmac('sha256', secret).update(payload).digest('base64url'),
  }
}

function verifyStoredSessionEnvelope(envelope: StoredAuthSessionEnvelope): StoredAuthSession | null {
  if (!envelope || typeof envelope !== 'object' || !envelope.d || typeof envelope.s !== 'string') {
    return null
  }

  const secret = getSessionCookieSecret()
  const payload = stableSessionPayload(envelope.d)
  const expected = createHmac('sha256', secret).update(payload).digest()
  const actual = Buffer.from(envelope.s, 'base64url')

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null
  }

  return envelope.d
}

function stableSessionPayload(stored: StoredAuthSession): string {
  return JSON.stringify({
    a: stored.a ?? stored.accessToken ?? null,
    e: stored.e ?? stored.expiresAt ?? null,
    r: stored.r ?? stored.roles ?? [],
    p: stored.p ?? stored.permissions ?? [],
  })
}

function getSessionCookieSecret(): string {
  const secret = process.env.MUSICLY_SESSION_SECRET ?? process.env.AUTH_SECRET

  if (!secret) {
    throw new Error('Missing MUSICLY_SESSION_SECRET or AUTH_SECRET for session cookie signing')
  }

  return secret
}
