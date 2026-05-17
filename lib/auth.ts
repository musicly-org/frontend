export interface AuthTokenResponse {
  accessToken: string
  tokenType: string
  expiresInSeconds: number
  roles: string[]
  permissions: string[]
}

export interface AuthSession extends AuthTokenResponse {
  email?: string
  displayName?: string
  expiresAt: string
}

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

export function hasPermission(session: AuthSession | null, permission: string): boolean {
  return session?.permissions.includes(permission) ?? false
}

export function primaryRoleLabel(session: AuthSession | null): string | undefined {
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
