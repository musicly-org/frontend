# Musicly Frontend

Musicly Frontend is a standalone Next.js application for browsing the Musicly catalog. It consumes the backend API root and follows HAL `_links` for all catalog navigation.

## Requirements

- Node.js 20+ recommended
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

If neither is set, the frontend falls back to:

```bash
http://localhost:8080
```

Example:

```bash
MUSICLY_BACKEND_URL=http://localhost:8080 npm run dev
```

## Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Architecture Notes

- Backend communication is centralized in [`lib/catalog-api.ts`](/home/alaksiej/Projects/musicly/frontend/lib/catalog-api.ts).
- The frontend must load the backend API root first, then follow `_links` for catalog resources.
- Frontend routes may use ids derived from backend self links, but the frontend must not generate backend API URLs from those ids.
- Reusable UI lives under `components/`, while route entrypoints stay under `app/`.

## Current Routes

- `/` for the artists index
- `/artists/[artistId]`
- `/albums/[albumId]`
- `/albums/[albumId]/releases/[releaseId]`
- `/songs/[songId]/tracks/[trackId]` as a compatibility route that forwards users into the canonical track experience
- `/track/[trackId]` as the canonical track details route

## Known Gap

- `npm run lint` is defined in `package.json`, but this repo does not currently include the ESLint dependencies or config needed for that script to run after a fresh clone.
