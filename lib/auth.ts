export interface AuthTokenResponse {
  accessToken: string
  tokenType: string
  expiresInSeconds: number
  roles: string[]
  permissions: string[]
}

export interface AuthSession {
  accessToken: string
  email?: string
  displayName?: string
  expiresAt: string
  roles: string[]
  permissions: string[]
}

export interface PublicAuthSession {
  email?: string
  displayName?: string
  expiresAt: string
  roles: string[]
  permissions: string[]
}

type SessionWithClaims = Pick<PublicAuthSession, 'roles' | 'permissions'>
type SessionWithRoles = Pick<PublicAuthSession, 'roles'>

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  displayName?: string
}

export interface AuthErrorResponse {
  message?: string
}

export function hasPermission(session: SessionWithClaims | null, permission: string): boolean {
  return session?.permissions.includes(permission) ?? false
}

export function primaryRoleLabel(session: SessionWithRoles | null): string | undefined {
  if (!session) {
    return undefined
  }

  if (session.roles.includes('SUPER_ADMIN')) {
    return 'Catalog admin'
  }

  if (session.roles.includes('REGULAR_USER')) {
    return 'Catalog reader'
  }

  return session.roles[0]
}
