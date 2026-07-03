# shared/ui

Shared layout, structural components, and UI primitives used across the entire application. All components here are framework-agnostic React — no `next/*` imports allowed.

## Files

| File | Description |
|------|-------------|
| `layouts/app-layout.tsx` | `AppLayout` — three-slot layout shell (header, sidebar, main). Accepts `children`, `header`, and `sidebar` as separate render props so each slot can be composed independently at the page level. |
| `components/header.tsx` | `Header` — fixed-height (`h-14`) top bar with a bottom border. Structural placeholder for app-wide navigation controls; renders the app name by default. |
| `components/sidebar.tsx` | `Sidebar` — fixed-width (`w-60`) left panel with a right border. Structural placeholder for primary navigation items. |
| `components/loader/loader.tsx` | `Loader` — inline loading indicator displayed while async operations are in-flight. |
| `components/loader/index.tsx` | Barrel re-export for `Loader`. |
| `components/errors/page-error.tsx` | `PageError` — full-page error state. Shows a message and a **Retry** button. Props: `message: string`, `onRetry: () => void`. |
| `components/errors/index.tsx` | Barrel re-export for `PageError`. |
| `index.ts` | Top-level barrel: `AppLayout`, `Header`, `Sidebar`, `Errors` (namespace re-export). |

## Components

### `AppLayout`

Three-slot shell for authenticated pages. Composes header, sidebar, and content area.

```tsx
import { AppLayout, Header, Sidebar } from "@/src/front-end/shared/ui";

<AppLayout
  header={<Header />}
  sidebar={<Sidebar />}
>
  {children}
</AppLayout>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Main page content rendered in the scrollable content area |
| `header` | `React.ReactNode` | Rendered in the top slot (full width, above the sidebar/content split) |
| `sidebar` | `React.ReactNode` | Rendered in the left slot (fixed width, full remaining height) |

### `Header`

Top navigation bar. Takes no props. Extend it with navigation controls, user menu, or breadcrumbs as the app grows.

```tsx
import { Header } from "@/src/front-end/shared/ui";
<Header />
```

### `Sidebar`

Left-side navigation panel. Takes no props. Extend it with `NavLink` items scoped to the current section.

```tsx
import { Sidebar } from "@/src/front-end/shared/ui";
<Sidebar />
```

### `Loader`

Inline loading indicator. Use inside Suspense boundaries or while awaiting async data.

```tsx
import { AppLayout } from "@/src/front-end/shared/ui";
// or import directly:
import Loader from "@/src/front-end/shared/ui/components/loader/loader";

<Loader />
```

### `Errors.PageError`

Full-page error state with retry support.

```tsx
import { Errors } from "@/src/front-end/shared/ui";

<Errors.PageError
  message="Failed to load tasks"
  onRetry={() => router.refresh()}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `message` | `string` | Human-readable error description |
| `onRetry` | `() => void` | Called when the user clicks **Retry** |

## Usage rules

- Always import from the barrel (`shared/ui`), not from individual component files
- Do not add domain knowledge here — components must be generic and portable
- Do not import `next/navigation`, `next/router`, or any `next/*` API
