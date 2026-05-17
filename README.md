# Musicly Frontend

Musicly Frontend is a standalone Next.js application for browsing the Musicly catalog.

The app is currently catalog-read-only, but it now supports backend-backed registration and login. It consumes the backend API as a HAL-style hypermedia API, follows backend-provided links, and renders catalog pages from that data.

## Requirements

- Node.js 20+
- npm
- A running Musicly backend

## Run Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The app runs on `http://localhost:3000` by default.

## Backend Configuration

Configure the backend base URL with one of these environment variables:

- `MUSICLY_BACKEND_URL`
- `NEXT_PUBLIC_MUSICLY_BACKEND_URL`
- `MUSICLY_SESSION_SECRET` or `AUTH_SECRET` for signing the frontend session cookie

If neither is set, the frontend falls back to:

```bash
http://127.0.0.1:8080
```

Example:

```bash
MUSICLY_BACKEND_URL=http://localhost:8080 npm run dev
```

## Authentication

- The frontend exposes `/auth` for sign-in and registration.
- Registration uses the backend `register` auth relation and creates regular users by default.
- Login and registration requests go through same-origin Next.js route handlers under `app/api/auth/*`.
- Successful auth stores the backend-issued token in an HTTP-only cookie so the browser does not call the backend auth endpoints cross-origin directly.

## Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Implemented Routes

- `/`: artists index
- `/artist/[artistId]`: artist details, albums, and songs
- `/release/[releaseId]`: release details, tracklist, and sibling releases
- `/track/[trackId]`: track details and other releases for the same song

## Frontend Architecture

- Route entrypoints live in `app/`.
- Page composition lives in `components/templates/`.
- Backend communication and data shaping live in [`lib/catalog-api.ts`](./lib/catalog-api.ts).
- Shared frontend resource types live in [`lib/types.ts`](./lib/types.ts).

## Business Logic Implemented On The Frontend

### 1. Hypermedia navigation

- The frontend starts from the backend API root.
- If the root already exposes catalog relations such as `artists`, it uses them directly.
- If the root is a top-level API root, the frontend follows the `catalog` link and then continues from there.
- The frontend does not hardcode backend collection URLs such as `/artists` or `/releases` when loading data.

### 2. Frontend route derivation from backend links

- Frontend route ids are extracted from backend `self` links.
- Frontend pages use backend-generated ids for local routing only.
- Backend resource URLs are resolved from backend-provided links and templates, not reconstructed from ids.
- Resource-by-id pages use backend root URI templates such as `artist`, `release`, and `track` to resolve canonical backend URLs.

### 3. Collection traversal and deduplication

- Collection loading follows HAL pagination by chasing `_links.next`.
- Paginated results are merged into a single list on the frontend.
- Merged collections are deduplicated by backend `self` link before rendering.

### 4. Artists index logic

- The home page loads the full artist collection from the backend.
- For each artist, the frontend loads that artist's albums relation and computes `albumCount`.
- The artist grid is therefore enriched on the frontend with album totals that are not returned as a dedicated backend field.

### 5. Artist page logic

- The artist page loads the artist resource plus linked albums and songs.
- Each album card routes to the album's default release page, not to a standalone album page.
- To do that, the frontend loads the album's releases, prefers the release marked `default`, and falls back to the first release if no explicit default exists.
- Artist albums are sorted by `releasedAt`, with dated albums before undated albums.
- Each song card loads the song's tracks relation and uses the first available track as the canonical detail route.
- Song artwork is taken from that first available track because songs themselves do not supply artwork in the frontend model.
- If a song has no tracks, the card stays non-navigable and is labeled `No tracks`.

### 6. Release page logic

- A release page is resolved from the release resource first, then canonical album context is loaded through the release's `album` link.
- The page loads album artists from the album relation, not from the release itself.
- The page loads all releases for the same album and renders them as sibling release cards.
- If the active release is missing from the fetched releases collection, the frontend injects it into the displayed release list and deduplicates the result.
- The album route used elsewhere in the app points to the default release page for that album.
- Tracklists are sorted by:
  1. `releasedAt` when present on both tracks
  2. `discNumber`
  3. `trackNumber`
- The release list highlights the current release and marks the default release.
- Multi-disc releases are detected on the frontend by checking whether any track has `discNumber > 1`.

### 7. Track page logic

- A track page loads the track resource, then loads the parent song through the track's `song` link.
- Artists displayed on the track page come from the song's `artists` relation.
- The page loads all tracks for the same song, deduplicates them, and sorts them by:
  1. `releasedAt` when present
  2. `discNumber`
  3. `trackNumber`
- The page infers all related releases by collecting each track's `release` link.
- For each related release, the frontend maps the release card to the first track page found in that release. This makes release switching on the track page keep the user in a track-detail flow instead of sending them to a release-detail page.
- The current release is identified from the selected track's `release` link and highlighted in the "Other Releases" list.

### 8. Display normalization

- Nullable backend strings such as `imageUrl` and `releasedAt` are normalized to `undefined` for frontend component use.
- Track durations are formatted on the frontend as `mm:ss`.
- Empty relations render explicit empty states instead of blank sections.
- When an image is missing, the UI falls back to the first character of the entity title or name.

## Important Constraints Followed By The Frontend

- The frontend consumes backend behavior through links and resource representations, not persistence shapes.
- The frontend treats release pages as the canonical way to view album details.
- The frontend treats track pages as the canonical way to view song details when a concrete track exists.
- The frontend assumes backend relation names remain consistent: `artists`, `albums`, `releases`, `songs`, and `tracks`.

## Known Gaps

- There are no frontend mutation flows yet.
- There is no standalone song detail route yet.
