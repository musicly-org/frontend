// Backend-derived data types for Musicly. `id` is the backend UUID extracted
// from a backend-provided self link and used for frontend routing.

export interface BackendLink {
  href: string
  templated?: boolean
}

export type BackendLinks = Record<string, BackendLink | undefined>

export interface LinkedResource {
  id: string
  href: string
  routeHref: string
  links: BackendLinks
}

export interface Artist extends LinkedResource {
  name: string
  imageUrl?: string
}

export interface Album extends LinkedResource {
  title: string
  releasedAt?: string
  imageUrl?: string
}

export interface AlbumVersion extends LinkedResource {
  title: string
  releasedAt?: string
  imageUrl?: string
  isDefault?: boolean
}

export interface Song extends LinkedResource {
  title: string
  releasedAt?: string
}

export interface SongVersion extends LinkedResource {
  title: string
  durationSeconds?: number
  releasedAt?: string
}

export interface Track extends LinkedResource {
  discNumber: number
  trackNumber: number
  songVersion?: SongVersion
}
