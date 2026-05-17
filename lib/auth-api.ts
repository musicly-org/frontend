import { fetchBackendDocumentJson, fetchBackendJson, requiredBackendLink, resolveBackendHref, backendBaseUrl } from '@/lib/backend'
import type { AuthErrorResponse, AuthTokenResponse, LoginPayload, RegisterPayload } from '@/lib/auth'
import type { BackendLinks } from '@/lib/types'

type HalResource = {
  _links?: BackendLinks
}

type AuthRootDocument = {
  href: string
  resource: HalResource
}

class BackendAuthError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

export async function loginAgainstBackend(payload: LoginPayload): Promise<AuthTokenResponse> {
  return postAuthRelation('login', payload)
}

export async function registerAgainstBackend(payload: RegisterPayload): Promise<AuthTokenResponse> {
  return postAuthRelation('register', payload)
}

export function isBackendAuthError(error: unknown): error is BackendAuthError {
  return error instanceof BackendAuthError
}

async function postAuthRelation(
  rel: 'login' | 'register',
  payload: LoginPayload | RegisterPayload,
): Promise<AuthTokenResponse> {
  const authRoot = await loadAuthRoot(rel)
  const href = resolveBackendHref(requiredBackendLink(authRoot.resource._links, rel).href, authRoot.href)
  const response = await fetch(href, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorBody = (await safeJson<AuthErrorResponse>(response)) ?? {}
    throw new BackendAuthError(errorBody.message ?? `Auth request failed with ${response.status}`, response.status)
  }

  return response.json() as Promise<AuthTokenResponse>
}

async function loadAuthRoot(rel: 'login' | 'register'): Promise<AuthRootDocument> {
  const apiRoot = await fetchBackendDocumentJson<HalResource>(backendBaseUrl)

  if (apiRoot.body._links?.[rel]) {
    return {
      href: apiRoot.href,
      resource: apiRoot.body,
    }
  }

  const authHref = resolveBackendHref(requiredBackendLink(apiRoot.body._links, 'auth').href, apiRoot.href)
  return {
    href: authHref,
    resource: await fetchBackendJson<HalResource>(authHref),
  }
}

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch {
    return null
  }
}
