import type {
  Album,
  AlbumVersion,
  Artist,
  BackendLink,
  BackendLinks,
  Song,
  SongVersion,
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

type AlbumVersionResource = HalResource & {
  title: string
  releasedAt?: string | null
  imageUrl?: string | null
  default?: boolean
}

type SongResource = HalResource & {
  title: string
  releasedAt?: string | null
}

type SongVersionResource = HalResource & {
  title: string
  durationSeconds?: number | null
  releasedAt?: string | null
}

type TrackResource = HalResource & {
  discNumber: number
  trackNumber: number
}

const backendBaseUrl =
  process.env.MUSICLY_BACKEND_URL ??
  process.env.NEXT_PUBLIC_MUSICLY_BACKEND_URL ??
  'http://localhost:8080'

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

async function findArtistAlbum(albumHref: string): Promise<{
  artistResource: ArtistResource
  albumResource: AlbumResource
} | undefined> {
  const artists = await fetchCollection<ArtistResource>(await loadRootLink('artists'))

  for (const artistResource of artists) {
    const albumsHref = optionalLink(artistResource._links, 'albums')

    if (!albumsHref) {
      continue
    }

    const albums = await fetchCollection<AlbumResource>(albumsHref)
    const albumResource = albums.find((album) => selfHref(album) === albumHref)

    if (albumResource) {
      return {
        artistResource,
        albumResource,
      }
    }
  }

  return undefined
}

async function fetchCollection<T extends HalResource>(href: string): Promise<T[]> {
  const items: T[] = []
  let nextHref: string | undefined = href

  while (nextHref) {
    const page: HalCollection<T> = await fetchJson<HalCollection<T>>(nextHref)
    items.push(...(page._embedded?.content ?? []))
    nextHref = page._links?.next?.href
  }

  return items
}

async function fetchResource<T extends HalResource>(href: string): Promise<T> {
  return fetchJson<T>(href)
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

export function artistRoute(href: string): string {
  return `/artists/${routeId(href)}`
}

export function albumRoute(href: string): string {
  return `/albums/${routeId(href)}`
}

export function albumVersionRoute(albumHref: string, versionHref: string): string {
  return `/albums/${routeId(albumHref)}/versions/${routeId(versionHref)}`
}

export function songRoute(href: string): string {
  return `/songs/${routeId(href)}`
}

export function songVersionRoute(songHref: string, versionHref: string): string {
  return `/songs/${routeId(songHref)}/versions/${routeId(versionHref)}`
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

function toAlbumVersion(
  resource: AlbumVersionResource,
  options: {
    albumHref?: string
    artistHref?: string
    versionsHref?: string
    albumTitle?: string | null
    albumReleasedAt?: string | null
    albumImageUrl?: string | null
    isDefault?: boolean
  } = {},
): AlbumVersion {
  const href = selfHref(resource)
  const albumHref = options.albumHref ?? optionalLink(resource._links, 'album') ?? href

  return {
    id: routeId(href),
    href,
    routeHref: albumVersionRoute(albumHref, href),
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

function toSongVersion(resource: SongVersionResource, songHref?: string): SongVersion {
  const href = selfHref(resource)
  const resolvedSongHref = songHref ?? optionalLink(resource._links, 'song') ?? href

  return {
    id: routeId(href),
    href,
    routeHref: songVersionRoute(resolvedSongHref, href),
    links: resource._links ?? {},
    title: resource.title,
    durationSeconds: resource.durationSeconds ?? undefined,
    releasedAt: optionalText(resource.releasedAt),
  }
}

function toTrack(resource: TrackResource, songVersion?: SongVersion): Track {
  const href = selfHref(resource)

  return {
    id: routeId(href),
    href,
    routeHref: '#',
    links: resource._links ?? {},
    discNumber: resource.discNumber,
    trackNumber: resource.trackNumber,
    songVersion,
  }
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

  return {
    artist,
    albums: albums.map(toAlbum),
    songs: songs.map(toSong),
  }
}

export async function loadArtistPageById(artistId: string): Promise<{
  artist: Artist
  albums: Album[]
  songs: Song[]
}> {
  return loadArtistPage(await expandRootTemplate('artist', artistId))
}

export async function loadAlbumVersions(versionsHref: string, options: {
  albumHref: string
  artistHref?: string
  albumTitle?: string | null
  albumReleasedAt?: string | null
  albumImageUrl?: string | null
}): Promise<AlbumVersion[]> {
  await loadRoot()

  const versions = await fetchCollection<AlbumVersionResource>(versionsHref)

  return versions.map((version, index) =>
    toAlbumVersion(version, {
      ...options,
      versionsHref,
      isDefault: index === 0,
    }),
  )
}

export async function loadDefaultAlbumVersionFromAlbum(albumHref: string, options: {
  artistHref?: string
  versionsHref?: string
  albumTitle?: string | null
  albumReleasedAt?: string | null
  albumImageUrl?: string | null
} = {}): Promise<AlbumVersion> {
  await loadRoot()

  const album = await fetchResource<AlbumResource>(albumHref)
  const versionsHref = options.versionsHref ?? link(album._links, 'album-versions').href
  const versions = await fetchCollection<AlbumVersionResource>(versionsHref)
  const version = versions.find((item) => item.default) ?? versions[0]

  if (!version) {
    throw new Error(`Album has no versions: ${albumHref}`)
  }

  return toAlbumVersion(version, {
    albumHref,
    artistHref: options.artistHref,
    versionsHref,
    albumTitle: options.albumTitle ?? album.title,
    albumReleasedAt: options.albumReleasedAt ?? album.releasedAt,
    albumImageUrl: options.albumImageUrl ?? album.imageUrl,
    isDefault: version.default ?? true,
  })
}

export async function loadDefaultAlbumVersionFromAlbumId(albumId: string, options: {
  artistId?: string
  albumTitle?: string | null
  albumReleasedAt?: string | null
  albumImageUrl?: string | null
} = {}): Promise<AlbumVersion> {
  const [albumHref, artistHref] = await Promise.all([
    expandRootTemplate('album', albumId),
    options.artistId ? expandRootTemplate('artist', options.artistId) : Promise.resolve(undefined),
  ])

  return loadDefaultAlbumVersionFromAlbum(albumHref, {
    artistHref,
    albumTitle: options.albumTitle,
    albumReleasedAt: options.albumReleasedAt,
    albumImageUrl: options.albumImageUrl,
  })
}

export async function loadAlbumVersionPage(options: {
  albumHref: string
  versionHref: string
  artistHref?: string
  versionsHref?: string
  albumTitle?: string | null
  albumReleasedAt?: string | null
  albumImageUrl?: string | null
}): Promise<{
  artist?: Artist
  album: Album
  version: AlbumVersion
  tracks: (Track & { songVersion: SongVersion })[]
  allVersions: AlbumVersion[]
}> {
  await loadRoot()

  const versionResource = await fetchResource<AlbumVersionResource>(options.versionHref)
  const canonicalAlbumHref = optionalLink(versionResource._links, 'album') ?? options.albumHref
  const linkedAlbum = await findArtistAlbum(canonicalAlbumHref)
  const fallbackAlbumResource = linkedAlbum?.albumResource ?? versionResource
  const albumFromBackend = toAlbum(fallbackAlbumResource)
  const linkedArtistHref = linkedAlbum ? selfHref(linkedAlbum.artistResource) : undefined
  const resolvedArtistHref = options.artistHref ?? optionalLink(fallbackAlbumResource._links, 'artist') ?? linkedArtistHref
  const resolvedVersionsHref = options.versionsHref ?? optionalLink(fallbackAlbumResource._links, 'album-versions')
  const versionResources = resolvedVersionsHref
    ? await fetchCollection<AlbumVersionResource>(resolvedVersionsHref)
    : [versionResource]
  const artistResource = linkedAlbum?.artistResource ?? (resolvedArtistHref ? await fetchResource<ArtistResource>(resolvedArtistHref) : undefined)
  const artist = artistResource ? toArtist(artistResource) : undefined
  const version = toAlbumVersion(versionResource, {
    albumHref: canonicalAlbumHref,
    artistHref: resolvedArtistHref,
    versionsHref: resolvedVersionsHref,
    albumTitle: options.albumTitle ?? albumFromBackend.title,
    albumReleasedAt: options.albumReleasedAt ?? albumFromBackend.releasedAt,
    albumImageUrl: options.albumImageUrl ?? albumFromBackend.imageUrl,
  })
  const album: Album = {
    ...albumFromBackend,
    routeHref: albumRoute(canonicalAlbumHref),
    links: {
      ...albumFromBackend.links,
      artist: resolvedArtistHref ? { href: resolvedArtistHref } : undefined,
      'album-versions': resolvedVersionsHref ? { href: resolvedVersionsHref } : undefined,
    },
    title: options.albumTitle ?? albumFromBackend.title,
    releasedAt: options.albumReleasedAt ?? albumFromBackend.releasedAt,
    imageUrl: options.albumImageUrl ?? albumFromBackend.imageUrl,
  }
  const versionListResources = versionResources.some((item) => selfHref(item) === options.versionHref)
    ? versionResources
    : [versionResource, ...versionResources]
  const allVersions = versionListResources
    .map((item) =>
      toAlbumVersion(item, {
        albumHref: canonicalAlbumHref,
        artistHref: resolvedArtistHref,
        versionsHref: resolvedVersionsHref,
        albumTitle: album.title,
        albumReleasedAt: album.releasedAt,
        albumImageUrl: album.imageUrl,
      }),
    )
  const tracks = await fetchTracks(link(version.links, 'tracks').href)

  return {
    artist,
    album,
    version,
    tracks,
    allVersions,
  }
}

export async function loadAlbumVersionPageByIds(albumId: string, versionId: string, options: {
  albumTitle?: string | null
  albumReleasedAt?: string | null
  albumImageUrl?: string | null
} = {}): Promise<{
  artist?: Artist
  album: Album
  version: AlbumVersion
  tracks: (Track & { songVersion: SongVersion })[]
  allVersions: AlbumVersion[]
}> {
  const [albumHref, versionHref] = await Promise.all([
    expandRootTemplate('album', albumId),
    expandRootTemplate('album-version', versionId),
  ])

  return loadAlbumVersionPage({
    albumHref,
    versionHref,
    albumTitle: options.albumTitle,
    albumReleasedAt: options.albumReleasedAt,
    albumImageUrl: options.albumImageUrl,
  })
}

export async function loadSongPage(songHref: string): Promise<{
  artist?: Artist
  song: Song
  versions: SongVersion[]
}> {
  await loadRoot()

  const song = toSong(await fetchResource<SongResource>(songHref))
  const [artistResource, versionResources] = await Promise.all([
    optionalLink(song.links, 'artist')
      ? fetchResource<ArtistResource>(link(song.links, 'artist').href)
      : Promise.resolve(undefined),
    fetchCollection<SongVersionResource>(link(song.links, 'song-versions').href),
  ])

  return {
    artist: artistResource ? toArtist(artistResource) : undefined,
    song,
    versions: versionResources.map((version) => toSongVersion(version, song.href)),
  }
}

export async function loadSongPageById(songId: string): Promise<{
  artist?: Artist
  song: Song
  versions: SongVersion[]
}> {
  return loadSongPage(await expandRootTemplate('song', songId))
}

export async function loadSongVersionPage(songHref: string, versionHref: string): Promise<{
  artist?: Artist
  song: Song
  version: SongVersion
}> {
  await loadRoot()

  const song = toSong(await fetchResource<SongResource>(songHref))
  const [artistResource, versionResource] = await Promise.all([
    optionalLink(song.links, 'artist')
      ? fetchResource<ArtistResource>(link(song.links, 'artist').href)
      : Promise.resolve(undefined),
    fetchResource<SongVersionResource>(versionHref),
  ])

  return {
    artist: artistResource ? toArtist(artistResource) : undefined,
    song,
    version: toSongVersion(versionResource, song.href),
  }
}

export async function loadSongVersionPageByIds(songId: string, versionId: string): Promise<{
  artist?: Artist
  song: Song
  version: SongVersion
}> {
  const [songHref, versionHref] = await Promise.all([
    expandRootTemplate('song', songId),
    expandRootTemplate('song-version', versionId),
  ])

  return loadSongVersionPage(songHref, versionHref)
}

async function fetchTracks(tracksHref: string): Promise<(Track & { songVersion: SongVersion })[]> {
  const tracks = await fetchCollection<TrackResource>(tracksHref)

  const enrichedTracks = await Promise.all(
    tracks.map(async (track) => {
      const songVersionHref = link(track._links, 'song-version').href
      const songVersion = toSongVersion(await fetchResource<SongVersionResource>(songVersionHref))

      return {
        ...toTrack(track, songVersion),
        songVersion,
      }
    }),
  )

  return enrichedTracks.sort((a, b) => {
    if (a.discNumber !== b.discNumber) {
      return a.discNumber - b.discNumber
    }

    return a.trackNumber - b.trackNumber
  })
}
