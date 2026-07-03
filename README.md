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

Next.js-specific code (server components, metadata exports, route handlers) lives exclusively in `src/app/` and acts as the thin hosting layer.

### Front-End (client-side, FSD)

All client-side code lives under `src/front-end/` and follows **Feature-Sliced Design**. Layers are ordered top-to-bottom; upper layers import from lower ones only:

```
src/front-end/
  features/    → business-process slices (login, logout, …)
  entities/    → typed representations of domain entities
  shared/      → reusable, non-business infrastructure
    http/      → typed HTTP client (`http` object, `ApiError`)
    routing/   → generated route constants and type-safe path builders
    ui/        → shared layout, structural components, and error primitives
```

`shared/` code has no imports from `next` or any framework-specific package — it is portable to any React host.

## Getting Started

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.
