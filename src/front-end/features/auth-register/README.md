## auth-register — User Registration

### Screen

The user is on the `/register` page, centered on the screen with a minimal layout (no sidebar, no top nav). The page renders the `RegisterForm`, passing in all display strings via the `i18n` prop and an `onSuccess` callback that performs the redirect (features never use `next/*` APIs, so navigation stays in `src/app/`).

### Form: `RegisterForm`

| Field | Type | Label source |
|-------|------|---------------|
| `name` | `<input type="text">` | `i18n.nameLabel` |
| `email` | `<input type="email">` | `i18n.emailLabel` |
| `password` | `<input type="password">` | `i18n.passwordLabel` |

A submit button renders `i18n.submitLabel`, switching to `i18n.submittingLabel` and disabling while a request is in-flight.

### User Flow

```
User opens /register
  → Sees RegisterForm (name + email + password fields, submit button)
  → Fills in name, email and password
  → Submits
    → [Validation] Input is checked against the shared credential (src/domain/credential)
      and user input (src/domain/user) schemas
        → If invalid: form-level error is shown, request is NOT sent
    → [Request sent] POST /api/v1/register with { name, email, password }
        → [Loading state] Button shows i18n.submittingLabel, disabled
        → [Success] Session cookie is set by the server; onSuccess(session) fires
            → Caller (the /register page) redirects to / (home)
        → [Error] Form-level error message from the API response body is shown
          (e.g. "Email already in use")
        → [Network failure] Form-level error: i18n.networkErrorMessage
```

### Folder structure

```
auth-register/
  ui/     RegisterForm.tsx  — form component
  model/  useRegister.ts    — form state, validation, submit handling
          types.ts          — IRegisterFormI18n
  api/    register.ts       — wraps gateway/httpl-client with entities/user's registerApi config
```

### Service: `register`

`api/register.ts` wraps `gateway/httpl-client` with `entities/user`'s `registerApi` config to call `POST /v1/register`. Returns `ApiResponse<ISession>`.
