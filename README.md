# Framework-Agnostic React App

## Goal

This project explores building a React application that is not tied to any specific framework. The current host is Next.js, but the core business logic — components, hooks, utilities, and domain modules — is written so it can be moved to a plain React app (no SSR, no server components) or any other React-based framework with zero changes to that code.

## Architecture

### Back-End (server-side)

Dependencies only flow downward through four layers:

```
src/app/api/      → HTTP handlers (cookies, request/response)
src/services/     → use-cases and orchestration
src/repositories/ → persistence (file I/O)
src/domain/       → pure business logic and entity types
```

Next.js-specific code (server components, metadata exports, route handlers) lives exclusively in `src/app/` and acts as the thin hosting layer. Sibling pages that need identical wrapper markup share it via a Next.js route group (e.g. `src/app/(app)/(auth)/layout.tsx` wraps both `/login` and `/register`) rather than duplicating a `layout.tsx` per page — route groups (`(name)`) don't add a URL segment.

### Front-End (client-side, FSD)

All client-side code lives under `src/front-end/` and follows **Feature-Sliced Design**. Layers are ordered top-to-bottom; upper layers import from lower ones only. See `src/front-end/README.md` for the full layer breakdown and conventions:

```
src/front-end/
  features/    → business-process slices (auth-login, auth-register, …), each split into ui/, model/, api/
  entities/    → typed representations of domain entities; re-export only their own api/* functions, never src/domain/ types
  gateway/     → composed, wired HTTP client (imported as `client`, not `httpClient`)
  shared/      → reusable, non-business infrastructure
    http/      → typed HTTP client primitives (`createClient`, `ApiError`)
    routing/   → deprecated, slated for removal — use plain path strings instead
    ui/        → shared layout, structural components, form/text primitives, and error primitives
```

`shared/` and `entities/` code has no imports from `next` or any framework-specific package — it is portable to any React host.

## API Documentation

Every route under `src/app/api/` has a colocated `_docs.json` (e.g. `src/app/api/v1/register/_docs.json`) describing its request/response shape, written via the `/document-api-route` project command ([.claude/commands/document-api-route.md](.claude/commands/document-api-route.md)):

- `input` is traced from the service's actual `validate(schema, ...)` calls, not its TypeScript parameter type.
- `output` is traced from the route handler's own `Response.json(...)` calls (one entry per status code actually returned), not the service's `Result<T>` — the route re-wraps that before the client sees it.
- Docs describe real behavior, including known bugs (e.g. some routes return failure bodies under HTTP `200` rather than a distinct status — see [TECH_DEBT.md](TECH_DEBT.md)), never the "intended" behavior.

These per-route files are grouped by their API version (`/v1/...`, `/v2/...`) and merged by `scripts/generate-openapi.mjs` (deterministic, no AI) into one OpenAPI document per version — `src/docs/openapi.v1.generated.json`, `src/docs/openapi.v2.generated.json`, etc. Each is statically imported and served live at its own versioned endpoint, e.g. `GET /api/openapi/v1`:

```bash
npm run generate:openapi
```

- **Postman**: Import → Link → `/api/openapi/v1` — Postman converts the OpenAPI document into a collection automatically.
- **Front-end codegen**: point an OpenAPI-to-TypeScript tool at the same versioned URL (tool not yet chosen).

Regeneration is currently manual (`npm run generate:openapi`) — a `predev`/`prebuild` hook to auto-run it was tried and removed mid-session; re-decide before relying on `src/docs/openapi.v1.generated.json` being current.

## Getting Started

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.
