## auth-login — User Login

### Screen

The user is on the `/login` page, centered on the screen with a minimal layout (no sidebar, no top nav). The page renders the `LoginForm`, passing in all display strings via the `i18n` prop and an `onSuccess` callback that performs the redirect (features never use `next/*` APIs, so navigation stays in `src/app/`).

### Form: `LoginForm`

| Field | Type | Label source |
|-------|------|---------------|
| `email` | `<input type="email">` | `i18n.emailLabel` |
| `password` | `<input type="password">` | `i18n.passwordLabel` |

A submit button renders `i18n.submitLabel`, switching to `i18n.submittingLabel` and disabling while a request is in-flight.

### User Flow

```
User opens /login
  → Sees LoginForm (email + password fields, submit button)
  → Fills in email and password
  → Submits
    → [Validation] Input is checked against the shared credential schema (src/domain/credential)
        → If invalid: form-level error is shown, request is NOT sent
    → [Request sent] POST /api/v1/login with { email, password }
        → [Loading state] Button shows i18n.submittingLabel, disabled
        → [Success] Session cookie is set by the server; onSuccess(session) fires
            → Caller (the /login page) redirects to / (home)
        → [Error] Form-level error message from the API response body is shown
        → [Network failure] Form-level error: i18n.networkErrorMessage
```

### Folder structure

```
auth-login/
  ui/     LoginForm.tsx     — form component
  model/  useLogin.ts       — form state, validation, submit handling
          types.ts          — ILoginFormI18n
  api/    login.ts          — wraps gateway/httpl-client with entities/session's loginApi config
```

### Service: `login`

`api/login.ts` wraps `gateway/httpl-client` with `entities/session`'s `loginApi` config to call `POST /v1/login`. Returns `ApiResponse<ISession>`.
