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
| `components/button/button.tsx` | `Button` — form/action button with `variant`, `size`, and icon slots. |
| `components/button/index.tsx` | Barrel re-export for `Button`. |
| `components/input/input.tsx` | `Input` — bare text input with a `size` prop. |
| `components/input/index.tsx` | Barrel re-export for `Input`. |
| `components/select/select.tsx` | `Select` — bare select with an `options` prop and a `size` prop. |
| `components/select/index.tsx` | Barrel re-export for `Select`. |
| `components/form/form.tsx` | `Form` — styled `<form>` wrapper with vertical spacing between fields. |
| `components/form/index.tsx` | Barrel re-export for `Form`. |
| `components/form-field/form-field.tsx` | `FormField` — label + error + control composite. Generic over `children`, so it wraps `Input`, `Select`, or any other control. |
| `components/form-field/index.tsx` | Barrel re-export for `FormField`. |
| `index.ts` | Top-level barrel: `AppLayout`, `Header`, `Sidebar`, `Errors` (namespace re-export), `Button`, `Input`, `Select`, `Form`, `FormField`. |

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

### `Button`

Form/action button. Extends all native `<button>` props.

```tsx
import { Button } from "@/src/front-end/shared/ui";

<Button variant="primary" size="md" startIcon={<PlusIcon />}>
  Add task
</Button>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `"primary" \| "secondary"` | Visual style. Defaults to `"primary"`. |
| `size` | `"sm" \| "md" \| "lg"` | Button height/padding/text scale. Defaults to `"md"`. |
| `startIcon` | `React.ReactNode` | Rendered before the label. |
| `endIcon` | `React.ReactNode` | Rendered after the label. |
| ...rest | `React.ComponentProps<"button">` | Passed through to the native `<button>` (e.g. `disabled`, `aria-busy`, `onClick`). |

A loading state is not built in — compose `Button` with `Loader` (or `aria-busy`/`disabled` passthrough) at the call site.

### `Input`

Bare text input — no built-in label or error rendering. Pair with `FormField` (or an external `<label htmlFor>`) at the call site.

```tsx
import { Input } from "@/src/front-end/shared/ui";

<label htmlFor="email">Email</label>
<Input id="email" size="md" type="email" />
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | Input height/padding/text scale. Defaults to `"md"`. |
| ...rest | `React.ComponentProps<"input">` | Passed through to the native `<input>` (e.g. `id`, `aria-invalid`, `onChange`). |

### `Select`

Bare select — no built-in label or error rendering. Pair with `FormField` (or an external `<label htmlFor>`) at the call site.

```tsx
import { Select } from "@/src/front-end/shared/ui";

<label htmlFor="role">Role</label>
<Select
  id="role"
  options={[
    { value: "admin", label: "Admin" },
    { value: "member", label: "Member" },
  ]}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `options` | `{ value: string; label: string }[]` | Rendered as `<option>` elements. |
| `size` | `"sm" \| "md" \| "lg"` | Select height/padding/text scale. Defaults to `"md"`. |
| ...rest | `React.ComponentProps<"select">` | Passed through to the native `<select>` (e.g. `id`, `aria-invalid`, `onChange`). |

### `Form`

Styled `<form>` wrapper. Extends all native `<form>` props; applies vertical spacing between children.

```tsx
import { Form, FormField, Input, Button } from "@/src/front-end/shared/ui";

<Form onSubmit={handleSubmit}>
  <FormField id="email" label="Email">
    <Input id="email" name="email" type="email" />
  </FormField>
  <Button type="submit">Submit</Button>
</Form>
```

`Form` does not manage state or validation — it is a layout/semantics wrapper only.

### `FormField`

Label + error + control composite. Generic over `children`, so it works with `Input`, `Select`, or any other control — the `id` passed to `FormField` must match the `id` on the wrapped control so the `<label>` associates correctly.

```tsx
import { FormField, Select } from "@/src/front-end/shared/ui";

<FormField id="role" label="Role" error={errors.role}>
  <Select
    id="role"
    name="role"
    options={[
      { value: "admin", label: "Admin" },
      { value: "member", label: "Member" },
    ]}
  />
</FormField>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Must match the wrapped control's `id`, used for `<label htmlFor>` association. |
| `label` | `string` | Field label text. |
| `error` | `string` (optional) | Error message rendered below the control when present (`role="alert"`). |
| `children` | `React.ReactNode` | The control (`Input`, `Select`, etc.) being labeled. |

## Usage rules

- Always import from the barrel (`shared/ui`), not from individual component files
- Do not add domain knowledge here — components must be generic and portable
- Do not import `next/navigation`, `next/router`, or any `next/*` API
