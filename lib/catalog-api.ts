import type {
  Album,
  Release,
  Artist,
  BackendLink,
  BackendLinks,
  Song,
  Track,
} from './types'

type HalResource = {
  _links?: BackendLinks
}

type HalCollection<T extends HalResource> = {
  _embedded?: {
    content?: T[]
  }
  _links?: BackendLinks
}

type ArtistResource = HalResource & {
  name: string
  imageUrl?: string | null
}

type AlbumResource = HalResource & {
  title: string
  releasedAt?: string | null
  imageUrl?: string | null
}

type ReleaseResource = HalResource & {
  title: string
  releasedAt?: string | null
  imageUrl?: string | null
  default?: boolean
}

type SongResource = HalResource & {
  title: string
  releasedAt?: string | null
}

type TrackResource = HalResource & {
  title: string
  imageUrl?: string | null
  durationSeconds?: number | null
  releasedAt?: string | null
  discNumber: number
  trackNumber: number
}

const backendBaseUrl =
  process.env.MUSICLY_BACKEND_URL ??
  process.env.NEXT_PUBLIC_MUSICLY_BACKEND_URL ??
  'http://127.0.0.1:8080'

function link(links: BackendLinks | undefined, rel: string): BackendLink {
  const item = links?.[rel]

  if (!item?.href) {
    throw new Error(`Missing backend link relation: ${rel}`)
  }

  return item
}

function optionalLink(links: BackendLinks | undefined, rel: string): string | undefined {
  return links?.[rel]?.href
}

function optionalText(value?: string | null): string | undefined {
  return value ?? undefined
}

async function fetchJson<T>(href: string): Promise<T> {
  const response = await fetch(href, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status} ${href}`)
  }

  return response.json() as Promise<T>
}

async function loadRoot(): Promise<HalResource> {
  return fetchJson<HalResource>(backendBaseUrl)
}

async function expandRootTemplate(rel: string, id: string): Promise<string> {
  const root = await loadRoot()
  const template = link(root._links, rel).href

  return template.replace('{id}', encodeURIComponent(id))
}

async function loadRootLink(rel: string): Promise<string> {
  const root = await loadRoot()
  return link(root._links, rel).href
}

async function fetchCollection<T extends HalResource>(href: string): Promise<T[]> {
  const items: T[] = []
  let nextHref: string | undefined = href

  while (nextHref) {
    const page: HalCollection<T> = await fetchJson<HalCollection<T>>(nextHref)
    items.push(...(page._embedded?.content ?? []))
    nextHref = page._links?.next?.href
  }

  return uniqueBy(items, (item) => item._links?.self?.href ?? JSON.stringify(item))
}

async function fetchResource<T extends HalResource>(href: string): Promise<T> {
  return fetchJson<T>(href)
}

async function fetchFirstCollectionItem<T extends HalResource>(href: string): Promise<T | undefined> {
  const page: HalCollection<T> = await fetchJson<HalCollection<T>>(href)
  return page._embedded?.content?.[0]
}

function selfHref(resource: HalResource): string {
  return link(resource._links, 'self').href
}

function routeId(href: string): string {
  const id = new URL(href).pathname.split('/').filter(Boolean).at(-1)

  if (!id) {
    throw new Error(`Cannot derive route id from backend link: ${href}`)
  }

  return id
}

function uniqueBy<T>(items: T[], keyOf: (item: T) => string): T[] {
  const seen = new Set<string>()

  return items.filter((item) => {
    const key = keyOf(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

export function artistRoute(href: string): string {
  return `/artists/${routeId(href)}`
}

export function albumRoute(href: string): string {
  return `/albums/${routeId(href)}`
}

export function releaseRoute(albumHref: string, releaseHref: string): string {
  return `/albums/${routeId(albumHref)}/releases/${routeId(releaseHref)}`
}

export function songRoute(href: string): string {
  return `/songs/${routeId(href)}`
}

export function trackRoute(trackHref: string): string {
  return `/track/${routeId(trackHref)}`
}

function toArtist(resource: ArtistResource): Artist {
  const href = selfHref(resource)

  return {
    id: routeId(href),
    href,
    routeHref: artistRoute(href),
    links: resource._links ?? {},
    name: resource.name,
    imageUrl: optionalText(resource.imageUrl),
  }
}

function toAlbum(resource: AlbumResource): Album {
  const href = selfHref(resource)

  return {
    id: routeId(href),
    href,
    routeHref: albumRoute(href),
    links: resource._links ?? {},
    title: resource.title,
    releasedAt: optionalText(resource.releasedAt),
    imageUrl: optionalText(resource.imageUrl),
  }
}

function toRelease(
  resource: ReleaseResource,
  options: {
    albumHref?: string
    artistHref?: string
    releasesHref?: string
    albumTitle?: string | null
    albumReleasedAt?: string | null
    albumImageUrl?: string | null
    isDefault?: boolean
  } = {},
): Release {
  const href = selfHref(resource)
  const albumHref = options.albumHref ?? optionalLink(resource._links, 'album') ?? href

  return {
    id: routeId(href),
    href,
    routeHref: releaseRoute(albumHref, href),
    links: resource._links ?? {},
    title: resource.title,
    releasedAt: optionalText(resource.releasedAt),
    imageUrl: optionalText(resource.imageUrl),
    isDefault: options.isDefault ?? resource.default,
  }
}

function toSong(resource: SongResource): Song {
  const href = selfHref(resource)

  return {
    id: routeId(href),
    href,
    routeHref: songRoute(href),
    links: resource._links ?? {},
    title: resource.title,
    releasedAt: optionalText(resource.releasedAt),
  }
}

function toTrack(resource: TrackResource): Track {
  const href = selfHref(resource)

  return {
    id: routeId(href),
    href,
    routeHref: trackRoute(href),
    links: resource._links ?? {},
    title: resource.title,
    imageUrl: optionalText(resource.imageUrl),
    durationSeconds: resource.durationSeconds ?? undefined,
    releasedAt: optionalText(resource.releasedAt),
    discNumber: resource.discNumber,
    trackNumber: resource.trackNumber,
  }
}

async function fetchLinkedArtists(links: BackendLinks | undefined): Promise<Artist[]> {
  const href = optionalLink(links, 'artists')

  if (!href) {
    return []
  }

  return uniqueBy((await fetchCollection<ArtistResource>(href)).map(toArtist), (artist) => artist.id)
}

export async function loadArtistsIndex(): Promise<(Artist & { albumCount: number })[]> {
  const artistsHref = await loadRootLink('artists')
  const artists = (await fetchCollection<ArtistResource>(artistsHref)).map(toArtist)

  return Promise.all(
    artists.map(async (artist) => {
      const albumsHref = link(artist.links, 'albums').href
      const albums = await fetchCollection<AlbumResource>(albumsHref)

      return {
        ...artist,
        albumCount: albums.length,
      }
    }),
  )
}

export async function loadArtistPage(artistHref: string): Promise<{
  artist: Artist
  albums: Album[]
  songs: Song[]
}> {
  await loadRoot()

  const artist = toArtist(await fetchResource<ArtistResource>(artistHref))
  const [albums, songs] = await Promise.all([
    fetchCollection<AlbumResource>(link(artist.links, 'albums').href),
    fetchCollection<SongResource>(link(artist.links, 'songs').href),
  ])

  const songsWithTrackRoutes = await Promise.all(
    songs.map(async (songResource) => {
      const song = toSong(songResource)
      const firstTrackResource = await fetchFirstCollectionItem<TrackResource>(link(song.links, 'tracks').href)
      const firstTrack = firstTrackResource ? toTrack(firstTrackResource) : undefined

      return firstTrack
        ? {
            ...song,
            imageUrl: firstTrack.imageUrl,
            routeHref: firstTrack.routeHref,
          }
        : song
    }),
  )

  return {
    artist,
    albums: albums
      .map(toAlbum)
      .sort((a, b) => {
        if (a.releasedAt && b.releasedAt) {
          return a.releasedAt.localeCompare(b.releasedAt)
        }

        if (a.releasedAt) {
          return -1
        }

        if (b.releasedAt) {
          return 1
        }

        return 0
      }),
    songs: songsWithTrackRoutes,
  }
}

export async function loadArtistPageById(artistId: string): Promise<{
  artist: Artist
  albums: Album[]
  songs: Song[]
}> {
  return loadArtistPage(await expandRootTemplate('artist', artistId))
}

export async function loadReleases(releasesHref: string, options: {
  albumHref: string
  artistHref?: string
  albumTitle?: string | null
  albumReleasedAt?: string | null
  albumImageUrl?: string | null
}): Promise<Release[]> {
  await loadRoot()

  const releases = await fetchCollection<ReleaseResource>(releasesHref)

  return releases.map((release, index) =>
    toRelease(release, {
      ...options,
      releasesHref,
      isDefault: index === 0,
    }),
  )
}

export async function loadDefaultReleaseFromAlbum(albumHref: string, options: {
  artistHref?: string
  releasesHref?: string
  albumTitle?: string | null
  albumReleasedAt?: string | null
  albumImageUrl?: string | null
} = {}): Promise<Release> {
  await loadRoot()

  const album = await fetchResource<AlbumResource>(albumHref)
  const releasesHref = options.releasesHref ?? link(album._links, 'releases').href
  const releases = await fetchCollection<ReleaseResource>(releasesHref)
  const release = releases.find((item) => item.default) ?? releases[0]

  if (!release) {
    throw new Error(`Album has no releases: ${albumHref}`)
  }

  return toRelease(release, {
    albumHref,
    artistHref: options.artistHref,
    releasesHref,
    albumTitle: options.albumTitle ?? album.title,
    albumReleasedAt: options.albumReleasedAt ?? album.releasedAt,
    albumImageUrl: options.albumImageUrl ?? album.imageUrl,
    isDefault: release.default ?? true,
  })
}

export async function loadDefaultReleaseFromAlbumId(albumId: string, options: {
  artistId?: string
  albumTitle?: string | null
  albumReleasedAt?: string | null
  albumImageUrl?: string | null
} = {}): Promise<Release> {
  const [albumHref, artistHref] = await Promise.all([
    expandRootTemplate('album', albumId),
    options.artistId ? expandRootTemplate('artist', options.artistId) : Promise.resolve(undefined),
  ])

  return loadDefaultReleaseFromAlbum(albumHref, {
    artistHref,
    albumTitle: options.albumTitle,
    albumReleasedAt: options.albumReleasedAt,
    albumImageUrl: options.albumImageUrl,
  })
}

export async function loadReleasePage(options: {
  albumHref: string
  releaseHref: string
  releasesHref?: string
  albumTitle?: string | null
  albumReleasedAt?: string | null
  albumImageUrl?: string | null
}): Promise<{
  artists: Artist[]
  album: Album
  release: Release
  tracks: Track[]
  allReleases: Release[]
}> {
  await loadRoot()

  const releaseResource = await fetchResource<ReleaseResource>(options.releaseHref)
  const canonicalAlbumHref = optionalLink(releaseResource._links, 'album') ?? options.albumHref
  const albumResource = await fetchResource<AlbumResource>(canonicalAlbumHref)
  const albumFromBackend = toAlbum(albumResource)
  const resolvedReleasesHref = options.releasesHref ?? optionalLink(albumResource._links, 'releases')
  const releaseResources = resolvedReleasesHref
    ? await fetchCollection<ReleaseResource>(resolvedReleasesHref)
    : [releaseResource]
  const artists = await fetchLinkedArtists(albumResource._links)
  const release = toRelease(releaseResource, {
    albumHref: canonicalAlbumHref,
    releasesHref: resolvedReleasesHref,
    albumTitle: options.albumTitle ?? albumFromBackend.title,
    albumReleasedAt: options.albumReleasedAt ?? albumFromBackend.releasedAt,
    albumImageUrl: options.albumImageUrl ?? albumFromBackend.imageUrl,
  })
  const album: Album = {
    ...albumFromBackend,
    routeHref: albumRoute(canonicalAlbumHref),
    links: {
      ...albumFromBackend.links,
      releases: resolvedReleasesHref ? { href: resolvedReleasesHref } : undefined,
    },
    title: options.albumTitle ?? albumFromBackend.title,
    releasedAt: options.albumReleasedAt ?? albumFromBackend.releasedAt,
    imageUrl: options.albumImageUrl ?? albumFromBackend.imageUrl,
  }
  const releaseListResources = releaseResources.some((item) => selfHref(item) === options.releaseHref)
    ? releaseResources
    : [releaseResource, ...releaseResources]
  const dedupedReleaseListResources = uniqueBy(
    releaseListResources,
    (item) => routeId(selfHref(item)),
  )
  const allReleases = dedupedReleaseListResources
    .map((item) =>
      toRelease(item, {
        albumHref: canonicalAlbumHref,
        releasesHref: resolvedReleasesHref,
        albumTitle: album.title,
        albumReleasedAt: album.releasedAt,
        albumImageUrl: album.imageUrl,
      }),
    )
  const tracks = await fetchTracks(link(release.links, 'tracks').href)

  return {
    artists,
    album,
    release,
    tracks: tracks.sort((a, b) => {
      if (a.releasedAt && b.releasedAt) {
        const releasedAtComparison = a.releasedAt.localeCompare(b.releasedAt)
        if (releasedAtComparison !== 0) {
          return releasedAtComparison
        }
      } else if (a.releasedAt) {
        return -1
      } else if (b.releasedAt) {
        return 1
      }

      if (a.discNumber !== b.discNumber) {
        return a.discNumber - b.discNumber
      }

      return a.trackNumber - b.trackNumber
    }),
    allReleases,
  }
}

export async function loadReleasePageByIds(albumId: string, releaseId: string, options: {
  albumTitle?: string | null
  albumReleasedAt?: string | null
  albumImageUrl?: string | null
} = {}): Promise<{
  artists: Artist[]
  album: Album
  release: Release
  tracks: Track[]
  allReleases: Release[]
}> {
  const [albumHref, releaseHref] = await Promise.all([
    expandRootTemplate('album', albumId),
    expandRootTemplate('release', releaseId),
  ])

  return loadReleasePage({
    albumHref,
    releaseHref,
    albumTitle: options.albumTitle,
    albumReleasedAt: options.albumReleasedAt,
    albumImageUrl: options.albumImageUrl,
  })
}

export async function loadTrackPage(trackHref: string): Promise<{
  artists: Artist[]
  currentReleasePageHref: string
  releases: Release[]
  selectedReleaseId?: string
  track: Track
}> {
  await loadRoot()

  const trackResource = await fetchResource<TrackResource>(trackHref)
  const track = toTrack(trackResource)
  const songHref = link(track.links, 'song').href
  const songResource = await fetchResource<SongResource>(songHref)
  const song = toSong(songResource)
  const releaseId = routeId(link(track.links, 'release').href)
  const artistsPromise = fetchLinkedArtists(song.links)
  const trackResources = await fetchCollection<TrackResource>(link(song.links, 'tracks').href)
  const allTracks = uniqueBy(
    trackResources.map((item) => toTrack(item)),
    (item) => item.id,
  ).sort((a, b) => {
    if (a.releasedAt && b.releasedAt) {
      const releasedAtComparison = a.releasedAt.localeCompare(b.releasedAt)
      if (releasedAtComparison !== 0) {
        return releasedAtComparison
      }
    } else if (a.releasedAt) {
      return -1
    } else if (b.releasedAt) {
      return 1
    }

    if (a.discNumber !== b.discNumber) {
      return a.discNumber - b.discNumber
    }

    return a.trackNumber - b.trackNumber
  })
  const releaseTrackHrefs = allTracks.reduce<Record<string, string>>((acc, item) => {
    const itemReleaseHref = optionalLink(item.links, 'release')
    if (!itemReleaseHref) {
      return acc
    }

    const itemReleaseId = routeId(itemReleaseHref)
    if (!acc[itemReleaseId]) {
      acc[itemReleaseId] = item.routeHref
    }

    return acc
  }, {})
  const releaseResources = await Promise.all(
    Object.keys(releaseTrackHrefs).map((id) => expandRootTemplate('release', id).then(fetchResource<ReleaseResource>)),
  )
  const releasePages = uniqueBy(
    releaseResources.map((resource) => toRelease(resource)),
    (release) => release.id,
  )
  const releases = releasePages.map((release) => ({
    ...release,
    routeHref: releaseTrackHrefs[release.id] ?? track.routeHref,
  }))
  const artists = await artistsPromise
  const currentReleasePage = releasePages.find((release) => release.id === releaseId)

  return {
    artists,
    currentReleasePageHref: currentReleasePage?.routeHref ?? track.routeHref,
    releases,
    selectedReleaseId: releaseId,
    track: allTracks.find((item) => item.id === track.id) ?? track,
  }
}

export async function loadTrackPageById(trackId: string): Promise<{
  artists: Artist[]
  currentReleasePageHref: string
  releases: Release[]
  selectedReleaseId?: string
  track: Track
}> {
  const trackHref = await expandRootTemplate('track', trackId)

  return loadTrackPage(trackHref)
}

async function fetchTracks(tracksHref: string): Promise<Track[]> {
  const tracks = await fetchCollection<TrackResource>(tracksHref)

  return uniqueBy(tracks.map((track) => toTrack(track)), (track) => track.id).sort((a, b) => {
    if (a.releasedAt && b.releasedAt) {
      const releasedAtComparison = a.releasedAt.localeCompare(b.releasedAt)
      if (releasedAtComparison !== 0) {
        return releasedAtComparison
      }
    } else if (a.releasedAt) {
      return -1
    } else if (b.releasedAt) {
      return 1
    }

    if (a.discNumber !== b.discNumber) {
      return a.discNumber - b.discNumber
    }

    return a.trackNumber - b.trackNumber
  })
}
