# shared/ui

Shared layout, structural components, and UI primitives used across the entire application. All components here are framework-agnostic React — no `next/*` imports allowed.

## Files

| File | Description |
|------|-------------|
| `layouts/app-layout.tsx` | `AppLayout` — three-slot layout shell (header, sidebar, main). Accepts `children`, `header`, and `sidebar` as separate render props so each slot can be composed independently at the page level. |
| `components/header.tsx` | `Header` — fixed-height (`h-14`) top bar with a bottom border. Takes `title` (left slot) and `actions` (right slot, e.g. a user menu) as `React.ReactNode`. |
| `components/sidebar.tsx` | `Sidebar` — fixed-width (`w-60`) left panel with a right border. Generic nav rail: takes `children` and renders them inside a `<nav>`; carries no nav-item shape or business knowledge itself. |
| `components/loader/loader.tsx` | `Loader` — circular spinner (`role="status"`, `sr-only` label) with a `size` prop (`"sm" \| "md" \| "lg"`). |
| `components/loader/index.tsx` | Barrel re-export for `Loader`. |
| `components/errors/page-error.tsx` | `PageError` — full-page error state. Props: `title: string`, `message: string`, `retryLabel: string`, `onRetry: () => void` — all copy is caller-supplied, nothing is hardcoded. |
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
| `components/text/text.tsx` | `Text` — polymorphic text primitive with `as` (tag) and `variant` (style) props. |
| `components/text/index.tsx` | Barrel re-export for `Text`. |
| `index.ts` | Top-level barrel: `AppLayout`, `Header`, `Sidebar`, `Errors` (namespace re-export), `Button`, `Input`, `Select`, `Form`, `FormField`, `Text`. |

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

Top navigation bar. Renders `title` on the left and `actions` on the right — both are opaque `React.ReactNode`, so `Header` never needs to know what a "user menu" or "app name" is.

```tsx
import { Header } from "@/src/front-end/shared/ui";

<Header
  title="Acme"
  actions={<span className="text-sm text-text-primary">Jane Doe</span>}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `title` | `React.ReactNode` | Rendered in the left slot. |
| `actions` | `React.ReactNode` (optional) | Rendered in the right slot (user menu, actions, etc.). |

### `Sidebar`

Left-side navigation panel. Renders whatever `children` it's given inside a `<nav>` — it has no opinion on nav-item shape, active state, or routing. Build the actual links at the call site (see the `next/link` note below).

```tsx
import { Sidebar } from "@/src/front-end/shared/ui";

<Sidebar>
  <a href="/dashboard" className="rounded-md px-2.5 py-1.5 text-sm bg-surface-sunken font-medium text-text-primary">
    Dashboard
  </a>
  <a href="/groups" className="rounded-md px-2.5 py-1.5 text-sm text-text-secondary">
    Groups
  </a>
</Sidebar>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` (optional) | Nav content, typically a list of links. |

### `Loader`

Circular spinner. Use inside Suspense boundaries or while awaiting async data.

```tsx
import { Loader } from "@/src/front-end/shared/ui";

<Loader size="sm" />
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `size` | `"sm" \| "md" \| "lg"` | Spinner diameter/stroke width. Defaults to `"md"`. |

### `Errors.PageError`

Full-page error state with retry support. All copy is passed in — nothing is hardcoded, matching the `i18n`-prop pattern used by feature forms (e.g. `LoginForm`).

```tsx
import { Errors } from "@/src/front-end/shared/ui";

<Errors.PageError
  title="Something went wrong"
  message="Failed to load tasks"
  retryLabel="Retry"
  onRetry={() => router.refresh()}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Heading shown above the message. |
| `message` | `string` | Human-readable error description. |
| `retryLabel` | `string` | Label for the retry button. |
| `onRetry` | `() => void` | Called when the user clicks retry. |

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

### `Text`

Polymorphic text primitive. Use it instead of raw `<h1>`/`<p>` tags so heading and body styles stay centralized.

```tsx
import { Text } from "@/src/front-end/shared/ui";

<Text as="h1" variant="heading">Welcome back</Text>
<Text variant="section">Assigned to you</Text>
<Text as="p" variant="body">Log in to continue to your account.</Text>
<Text variant="meta">Updated 2 days ago</Text>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `as` | `"h1" \| "h2" \| "h3" \| "p" \| "span"` | Rendered HTML tag. Defaults to `"p"`. |
| `variant` | `"heading" \| "section" \| "body" \| "meta"` | Visual style, independent of `as`. `heading` is a page/section title, `section` is an uppercase group label, `body` is default copy, `meta` is muted caption text (timestamps, counts). Defaults to `"body"`. |
| ...rest | `React.ComponentProps<"p">` | Passed through to the rendered element. |

## Usage rules

- Always import from the barrel (`shared/ui`), not from individual component files
- Do not add domain knowledge here — components must be generic and portable
- Do not import `next/navigation`, `next/router`, or any `next/*` API
- **This restriction is on imports inside this package, not on what callers pass through `children`/render-prop slots** (`Sidebar`'s `children`, `AppLayout`'s `header`/`sidebar`/`children`, `Header`'s `actions`, etc.). A page under `src/app/**` is the Next.js host layer and may freely use `next/link`'s `<Link>` — it can build `<Link href="/dashboard">Dashboard</Link>` and hand it to `Sidebar` as a child. `Sidebar` itself just renders `React.ReactNode`, so it never needs to know `Link` exists. Front-end layers below `app/` (`features/`, `gateway/`, `entities/`, this package) must still use plain `<a href>` for any links they construct themselves, since they cannot import `next/*` at all.
