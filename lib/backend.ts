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
  const document = await fetchBackendDocumentJson<T>(href, init)
  return document.body
}

export async function fetchBackendDocumentJson<T>(
  href: string,
  init: RequestInit = {},
): Promise<{ href: string, body: T }> {
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

  return {
    href: response.url,
    body: normalizeHalLinks((await response.json()) as T, response.url),
  }
}

function normalizeHalLinks<T>(value: T, baseHref: string): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeHalLinks(item, baseHref)) as T
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const record = value as Record<string, unknown>
  const normalized: Record<string, unknown> = { ...record }

  if (record._links && typeof record._links === 'object') {
    normalized._links = normalizeBackendLinks(record._links as Record<string, unknown>, baseHref)
  }

  for (const [key, child] of Object.entries(record)) {
    if (key === '_links') {
      continue
    }

    normalized[key] = normalizeHalLinks(child, baseHref)
  }

  return normalized as T
}

function normalizeBackendLinks(
  links: Record<string, unknown>,
  baseHref: string,
): Record<string, unknown> {
  const normalized: Record<string, unknown> = {}

  for (const [rel, linkValue] of Object.entries(links)) {
    normalized[rel] = normalizeBackendLinkValue(linkValue, baseHref)
  }

  return normalized
}

function normalizeBackendLinkValue(value: unknown, baseHref: string): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeBackendLinkValue(item, baseHref))
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const record = value as Record<string, unknown>

  if (typeof record.href === 'string') {
    return {
      ...record,
      href: resolveBackendLinkHref(record.href, baseHref, record.templated === true),
    }
  }

  const normalized: Record<string, unknown> = {}

  for (const [key, child] of Object.entries(record)) {
    normalized[key] = normalizeBackendLinkValue(child, baseHref)
  }

  return normalized
}

function resolveBackendLinkHref(href: string, baseHref: string, templated: boolean): string {
  if (!templated && !href.includes('{')) {
    return resolveBackendHref(href, baseHref)
  }

  const normalizedHref = href
    .replaceAll('{', '__MUSICLY_URI_TEMPLATE_OPEN__')
    .replaceAll('}', '__MUSICLY_URI_TEMPLATE_CLOSE__')

  return resolveBackendHref(normalizedHref, baseHref)
    .replaceAll('__MUSICLY_URI_TEMPLATE_OPEN__', '{')
    .replaceAll('__MUSICLY_URI_TEMPLATE_CLOSE__', '}')
}
