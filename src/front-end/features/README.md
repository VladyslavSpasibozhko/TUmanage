# features/

Business-process slices. Each folder is one user-facing flow, fully self-contained: form components, hooks, service calls, and local state are all scoped to the feature.

## Rules

- One folder per user-facing flow, named `<domain>-<action>` (e.g. `auth-login`, `task-create`)
- May import from `entities/`, `gateway/`, and `shared/` — never from other `features/`
- Service calls go through `gateway/`, not `shared/http` directly
- Must never import from `src/app/` or use `next/*` APIs
- Every feature folder must contain a `README.md` documenting the full user flow

## Feature Folder Structure

```
features/
  auth-login/
    README.md       ← this file (flow description)
    LoginForm.tsx   ← form component
    useLogin.ts     ← hook: form state, validation, service call
    service.ts      ← API call (wraps shared/http)
  auth-logout/
    README.md
    LogoutButton.tsx
    service.ts
```

---

## auth-login — User Login

### Screen

The user is on the `/login` page, centered on the screen with a minimal layout (no sidebar, no top nav). The page shows a heading and a login form.

### Form: `LoginForm`

Two fields are displayed:

| Field | Type | Label | Validation |
|-------|------|-------|------------|
| `email` | `<input type="email">` | Email | Required; must match email format |
| `password` | `<input type="password">` | Password | Required; must not be empty |

A **Log in** submit button is rendered below the fields. The button is disabled while a request is in-flight.

### User Flow

```
User opens /login
  → Sees LoginForm (email + password fields, Log in button)
  → Fills in email and password
  → Clicks "Log in"
    → [Validation] If any field is empty or email is malformed:
        → Inline field error shown beneath the invalid field
        → Request is NOT sent
    → [Request sent] POST /api/v1/login with { email, password }
        → [Loading state] Button shows "Logging in…", fields are disabled
        → [Success — 200 OK]
            → Session cookie is set by the server
            → User is redirected to / (home)
        → [Error — 401 Unauthorized]
            → Form-level error: "Invalid email or password"
            → Fields are re-enabled, button resets to "Log in"
        → [Error — 422 Unprocessable Entity]
            → Field-level error rendered next to the relevant field
            → Fields are re-enabled
        → [Error — 500 / network failure]
            → Form-level error: "Something went wrong. Please try again."
            → Fields are re-enabled, button resets to "Log in"
```

### Service: `auth.login`

```ts
// front-end/services/auth.login.ts
import { http } from "@/src/front-end/gateway/http";

export async function login() {
  return http.post("/v1/login", {});
}
```

Calls `POST /api/v1/login`. Returns `ApiResponse<Session>`.

---

## auth-logout — User Logout

### Screen

The user is authenticated and sees a **Log out** button, typically in the `Header` or a user-menu dropdown.

### User Flow

```
User clicks "Log out"
  → [Optional] Confirmation prompt: "Are you sure you want to log out?"
      → User confirms
  → [Request sent] POST /api/v1/logout
      → [Loading state] Button shows "Logging out…" and is disabled
      → [Success — 200 OK]
          → Session cookie is cleared by the server
          → User is redirected to /login
      → [Error — network failure]
          → Toast or inline error: "Logout failed. Please try again."
          → Button is re-enabled
```

### Service: `auth.logout`

```ts
// front-end/services/auth.logout.ts
import { http } from "@/src/front-end/gateway/http";

export async function logout() {
  return http.post("/v1/logout", {});
}
```

Calls `POST /api/v1/logout`. Returns `ApiResponse<void>`.

---

## Adding a New Feature

1. Create `features/<domain>-<action>/` folder
2. Write `README.md` following this template:

```markdown
## <feature-name> — <human title>

### Screen
[Which page/screen the user is on]

### Form / UI
[Fields, buttons, and their validations]

### User Flow
[Step-by-step: initial state → user action → loading → success → each error case]

### Service
[Which API endpoint is called and what it returns]
```

3. Implement: form component, hook (state + validation + service call), service module
4. Export from `index.ts`
