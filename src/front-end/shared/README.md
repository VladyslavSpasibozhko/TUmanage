# shared/

Reusable, non-business infrastructure. Code here has no knowledge of the application's domain — it could be extracted to an npm package and used in any React project.

## Import rules

- May import from external libraries (`react`, `react-dom`, plain JS/TS utilities)
- Must never import from `entities/` or `features/`
- Must never use `next/*` or any other framework-specific package

## Sub-libraries

Each sub-library is a self-contained module with its own `README.md` and a single `index.ts` barrel export.

| Folder | Purpose |
|--------|---------|
| [`http/`](./http/README.md) | Typed `fetch` wrapper (`http` object) and `ApiError` class |
| [`routing/`](./routing/README.md) | Generated route constants and type-safe path-builder functions |
| [`ui/`](./ui/README.md) | Shared layout (`AppLayout`), structural components (`Header`, `Sidebar`), error and loading primitives |

## File Descriptions

### `http/`

| File | Description |
|------|-------------|
| `client.ts` | Defines the `http` object — a thin `fetch` wrapper that sets `Content-Type: application/json`, throws `ApiError` on non-2xx responses, and returns typed `ApiResponse<T>` |
| `errors.ts` | Defines `ApiError`, an `Error` subclass carrying the HTTP status `code` |
| `index.ts` | Barrel re-export: `http`, `ApiError` |

### `routing/`

| File | Description |
|------|-------------|
| `routes.generated.ts` | Auto-generated list of all Next.js app routes as a `const` array (`APP_ROUTES`) and the `AppPath` union type. Do not edit manually. |
| `handlers.generated.ts` | Auto-generated type-safe path-builder functions (e.g. `login()`, `adminCompanyId({ id })`) that resolve dynamic segments and append query strings. Do not edit manually. |
| `types.ts` | Defines `RouteConfig` — a typed descriptor for a named route (path, display label, required permission) |
| `index.ts` | Barrel re-export: `APP_ROUTES`, `appRoutes` (all path builders), `AppPath`, `RouteConfig` |
| `scripts/generate.mjs` | Node script that scans `src/app/` for `page.*` files and writes `routes.generated.ts` and `handlers.generated.ts`. Run via `npm run generate:routes`. |
| `utils/generateHandlers.mjs` | Pure function that converts a list of route strings into TypeScript source code for the handler functions |
| `utils/generateHandlers.test.mjs` | Unit tests for `generateHandlers` |

### `ui/`

| File | Description |
|------|-------------|
| `layouts/app-layout.tsx` | `AppLayout` — three-slot layout (header, sidebar, main content). Accepts `children`, `header`, and `sidebar` as separate render props for maximum flexibility. |
| `components/header.tsx` | `Header` — top navigation bar (fixed height, border-bottom). Placeholder for app-wide navigation controls. |
| `components/sidebar.tsx` | `Sidebar` — fixed-width left panel (border-right). Placeholder for navigation items. |
| `components/loader/loader.tsx` | `Loader` — inline loading indicator shown while async data is in-flight. |
| `components/loader/index.tsx` | Barrel re-export for `Loader`. |
| `components/errors/page-error.tsx` | `PageError` — full-page error state with a message and a **Retry** button. Accepts `message: string` and `onRetry: () => void`. |
| `components/errors/index.tsx` | Barrel re-export for `PageError`. |
| `index.ts` | Barrel re-export for all `ui/` exports: `AppLayout`, `Header`, `Sidebar`, `Errors`. |
