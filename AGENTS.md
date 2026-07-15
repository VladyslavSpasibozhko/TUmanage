<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Front-End Architecture (FSD)

All client-side code lives under `src/front-end/` and follows **Feature-Sliced Design (FSD)**. Layers are ordered top-to-bottom; upper layers may import from lower layers, never the reverse.

```
src/front-end/
  features/    → business-process slices (login, logout, etc.)
  entities/    → front-end representations of domain entities (User, Task, Session, …)
  gateway/     → composed, wired clients (auth refresh, base URL, etc.), may have side effects
  shared/      → reusable, non-business infrastructure
    http/      → typed HTTP client primitives
    routing/   → generated route constants and path builders
    ui/        → shared layout components and design primitives
```

**Rules:**
- `shared/` must never import from `entities/`, `gateway/`, or `features/`
- `entities/` must never import from `gateway/` or `features/`
- `gateway/` may import from `shared/` and `entities/`, never from `features/`
- `features/` may import from `entities/`, `gateway/`, and `shared/`
- No layer may import from `src/app/` (Next.js host) or use `next/*` APIs
- Each feature documents its full user-facing flow: screen, inputs, success path, error paths

See `src/front-end/README.md` for the full FSD layer guide.
