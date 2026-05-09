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
- Prefer following HATEOAS `_links` when present.
- Avoid hardcoding backend URLs outside the API client/bootstrap configuration.

Expected relation names:

- `artists`
- `albums`
- `releases`
- `songs`
- `tracks`

## UI Structure

- Use atomic design for UI components.
- Place reusable components under `components/{atoms,molecules,organisms,templates}`.
- App routes in `app/` should compose templates/organisms, not contain reusable layout primitives.
- Separate pages from reusable UI components.
- Keep API models separate from view models when transformations are needed.
- Handle loading, error, and empty states explicitly.
- Keep routing and data-fetching boundaries clear.

Expected catalog experiences:

- Artists list
- Artist details
- Albums list
- Releases
- Tracklist view

## Testing

- Test non-trivial UI behavior.
- Avoid low-value snapshot tests.
- Prefer tests that verify user-visible behavior and API-client integration boundaries.
