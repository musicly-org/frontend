import type { BackendLink, BackendLinks } from '@/lib/types'

export const backendBaseUrl =
  process.env.MUSICLY_BACKEND_URL ??
  process.env.NEXT_PUBLIC_MUSICLY_BACKEND_URL ??
  'http://127.0.0.1:8080'

export function resolveBackendHref(href: string, baseHref: string = backendBaseUrl): string {
  return new URL(href, baseHref).toString()
}

export function requiredBackendLink(links: BackendLinks | undefined, rel: string): BackendLink {
  const item = links?.[rel]

  if (!item?.href) {
    throw new Error(`Missing backend link relation: ${rel}`)
  }

  return item
}

export async function fetchBackendJson<T>(href: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(resolveBackendHref(href), {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status} ${href}`)
  }

  return response.json() as Promise<T>
}
