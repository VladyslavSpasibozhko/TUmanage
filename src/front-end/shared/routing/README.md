# shared/routing

Type-safe route constants and path-builder functions, auto-generated from the Next.js `src/app/` directory. Prevents hard-coded strings and ensures every navigation target is valid at compile time.

## Files

| File | Description |
|------|-------------|
| `routes.generated.ts` | `APP_ROUTES` — a `const` array of all app paths; `AppPath` — the union type of all valid paths. **Do not edit manually.** |
| `handlers.generated.ts` | A named function per route that returns the resolved path string (fills dynamic segments, appends query params). **Do not edit manually.** |
| `types.ts` | `RouteConfig` — descriptor for a named route: `{ path: AppPath; label: string; permission: string \| null }` |
| `index.ts` | Barrel re-export: `APP_ROUTES`, `appRoutes`, `AppPath`, `RouteConfig` |
| `scripts/generate.mjs` | CLI script that scans `src/app/` and writes the two generated files. Invoked via `npm run generate:routes`. |
| `utils/generateHandlers.mjs` | Pure function: `(routes: string[]) => string` — converts a route list into TypeScript source for handler functions |
| `utils/generateHandlers.test.mjs` | Unit tests for `generateHandlers` |

## Generating routes

Run once after adding or removing pages:

```bash
npm run generate:routes
```

This calls `scripts/generate.mjs --app=/src/app`, which:
1. Recursively scans `src/app/` for `page.(tsx|ts|jsx|js)` files
2. Skips parallel-route slots (`@folder`)
3. Strips route-group segments (`(group)`)
4. Writes `routes.generated.ts` and `handlers.generated.ts`

## Usage

```ts
import { appRoutes, APP_ROUTES, type AppPath } from "@/src/front-end/shared/routing";

// Static navigation
router.push(appRoutes.login());                          // "/login"
router.push(appRoutes.admin());                          // "/admin"

// Dynamic segment
router.push(appRoutes.adminCompanyId({ id: "42" }));    // "/admin/company/42"

// With query string
router.push(appRoutes.adminCompany({ page: 2 }));       // "/admin/company?page=2"

// Type-safe route check
function isValidPath(s: string): s is AppPath {
  return (APP_ROUTES as readonly string[]).includes(s);
}
```

## Current routes

| Path | Handler function |
|------|-----------------|
| `/` | `appRoutes.root()` |
| `/admin` | `appRoutes.admin()` |
| `/admin/company` | `appRoutes.adminCompany()` |
| `/admin/company/[id]` | `appRoutes.adminCompanyId({ id })` |
| `/admin/company/address` | `appRoutes.adminCompanyAddress()` |
| `/admin/company/location` | `appRoutes.adminCompanyLocation()` |
| `/login` | `appRoutes.login()` |

## Usage rules

- Always use `appRoutes.*` functions instead of hard-coded path strings
- Never import from `routes.generated.ts` or `handlers.generated.ts` directly — use the barrel (`shared/routing`)
- Do not call `next/navigation` or `next/router` inside `shared/` — pass the resolved path string up to the `src/app/` layer
