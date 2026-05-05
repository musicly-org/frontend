# AGENTS.md

## Frontend Project

The frontend is an independent Next.js + React project located in `frontend/`.

Stack:

- Next.js App Router
- React
- TypeScript

## Build Rules

- Frontend package/config files must live inside `frontend/`.
- Do not add frontend build tooling at repository root.
- Run frontend commands from `frontend/`.

Common commands:

```bash
npm install
npm run dev
npm run build
```

## API Usage

- Backend is the source of truth.
- Centralize backend communication in an API client layer.
- Do not scatter raw `fetch` calls across UI components.
- Do not depend on backend persistence/entity shapes.
- Before loading catalog data, load the backend API root resource first.
- The backend base URL is the only backend URL the frontend may configure directly.
- Never generate backend API paths or resource URLs in frontend code.
- All catalog requests after bootstrap must use URLs obtained from backend `_links`.
- Follow root `_links` for entry points such as artists, albums, songs, versions, and tracks.
- Follow each resource's `_links` for related data and navigation.
- Treat relation names as the contract; do not infer URLs from ids, slugs, route names, or entity shapes.
- Keep link traversal and response parsing in the API client layer.

Expected relation names:

- `artists`
- `albums`
- `album-versions`
- `songs`
- `song-versions`
- `tracks`

## UI Structure

- Use the Next.js App Router under `app/`.
- Use atomic design for frontend components.
- Place shadcn/Radix-style primitives and tiny presentational building blocks under `components/ui` or `components/atoms`.
- Place simple component combinations under `components/molecules`.
- Place section-level compositions under `components/organisms`.
- Place page-level compositions under `components/templates`.
- Place non-visual React context providers under `components/providers`.
- Keep `app/` routes thin; they should compose templates and trigger data loading, not hold reusable UI.
- Routes in `app/` should compose templates and reusable components, not contain reusable layout primitives.
- Separate routes from reusable UI components.
- Keep API models separate from view models when transformations are needed.
- Handle loading, error, and empty states explicitly.
- Keep routing and data-fetching boundaries clear.
- When moving existing components toward atomic design, prefer incremental refactors over broad directory churn.
- Do not put data-fetching logic in atoms, molecules, or organisms; keep it in routes, templates, or the API client layer.

Expected catalog experiences:

- Artists list
- Artist details
- Albums list
- Album versions
- Tracklist view

## Testing

- Test non-trivial UI behavior.
- Avoid low-value snapshot tests.
- Prefer tests that verify user-visible behavior and API-client integration boundaries.
