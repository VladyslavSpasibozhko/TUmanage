# Auth Implementation Plan

Implementation plan for the Auth flows only (Registration, Login, Logout, Session Refresh). Password Reset is explicitly deferred. This plan follows the layered architecture in [CLAUDE.md](CLAUDE.md) — changes flow `domain/` → `repositories/` → `services/` → `app/api/` → front-end.

---

## Decisions this plan implements

1. **Registration** — a new `Credential` entity (email + password hash) is created alongside `User`. Email verification is not required (user is logged in immediately after registering).
2. **Login** — Multiple concurrent sessions per user are allowed (logging in on a new device does not invalidate existing sessions). Failure responses are generic ("Invalid email or password") regardless of whether the email exists or the password is wrong.
3. **Logout** — Ends only the current session (the one in the request's cookie), not all sessions for the user.
4. **Session Expiration** — A refresh endpoint extends `expiredAt` on an active session. Expired sessions cannot be refreshed — user must log in again.
5. **Password Reset** — Out of scope. Not designed or stubbed in this pass.

## Revised: Credential is a separate domain entity from User

Originally this plan put `passwordHash` directly on `IUser`. That was wrong: `User` is a pure representation of a registered person (id, name, email, createdAt); it has no business owning authentication material. `Session` is the representation of an already-authenticated visit; it has no business owning it either. Neither should carry the password.

Instead, credentials are their own entity, linked to `User` by `email`:

- `domain/credential/` — `ICredential { email: string; password: string }`, `credentialSchema` (email + password, min length 8), plus `createCredential`/`updateCredential`. Password is currently stored and compared as plain text — hashing was planned (`hashPassword`/`verifyPassword` via `crypto.scrypt`) but never implemented; tracked as tech debt in [TECH_DEBT.md](TECH_DEBT.md) instead of in this plan.
- `repositories/credential.ts` — `saveCredential`, `getCredentialByEmail`. Backed by `src/db/credentials.json`.

`register` now does two separate saves: a `User` (profile) and a `Credential` (email + password, plain text). `login` looks up the `Credential` by email to compare the password directly, then looks up the `User` by email to build the session.

## Note on domain folder structure

`domain/user/`, `domain/session/`, and `domain/credential/` are folders (`types.ts`, `schema.ts`, `index.ts` barrel), not single flat files as earlier drafts of this plan assumed. New domain entities should follow this same three-file pattern.

## New convention: `services/` must use `shared/utils/outcome`

Every service function returns `success(data)` or `failure(error)` from `src/shared/utils/outcome` (barrel: `import { outcome } from "@/src/shared/utils"`) instead of hand-writing `{ ok, data, error }` object literals. This is a project-wide convention now, not specific to auth — `login`, `register`, `session`, `task`, and `group` services have already been migrated.

`Result<T>` (`{ ok: true; data: T } | { ok: false; error: string }`) is defined in `shared/utils/outcome/types.ts` — `error` is a plain string, not an `Error` instance; callers normalize caught exceptions via `shared/utils/error`'s `getErrorMessage`.

## Defaults assumed for this plan (flag if wrong, otherwise proceeding)

- Password policy: minimum 8 characters, no complexity rules (can tighten later).
- Hashing: Node's built-in `crypto.scrypt` with a per-password random salt — no new dependency needed.
- No cap on concurrent sessions per user.
- No absolute session lifetime ceiling (a session refreshed forever never fully expires) — flagged as future hardening, not blocking.
- No "logout of all devices" action in this pass.
- Refresh trigger (automatic on activity vs. manual button) is a front-end decision made in Phase 5, not baked into the endpoint itself — the endpoint just does one thing: extend expiry if the session is currently active.

---

## Phase 1 — Domain layer (pure logic, no I/O beyond existing `crypto` usage)

### `src/domain/credential/` (new)
- `types.ts` — `ICredential { email, password }` — done.
- `schema.ts` — `credentialSchema` — done.
- `index.ts` — `createCredential`, `updateCredential` — done. Password hashing
  (`hashPassword`/`verifyPassword`) was originally planned here but was never
  implemented; it's tracked as tech debt (see [TECH_DEBT.md](TECH_DEBT.md))
  rather than as an open item of this plan.

### `src/domain/session/`
- `refreshSession(session: ISession): ISession` — done. Pure function, returns `{ ...session, expiredAt: Date.now() + SESSION_LIFETIME_MS }`. Does not itself check `isSessionActive` — that check happens where the decision is made (service layer), keeping this function a simple transformation.

### `src/domain/user/`
- No password-related changes — confirmed reverted to id/name/email/createdAt only.

---

## Phase 2 — Repository layer

### `src/repositories/credential.ts` (new) — done
- `saveCredential(credential)` — upserts by email.
- `getCredentialByEmail(email)`.

### `src/repositories/session.ts`
- `deleteSession(id: string): Promise<void>` — done (logout support).
- `createSession(session)` already upserts by id, reused as-is to persist a refreshed session — no new save function needed.

### `src/repositories/user.ts`
- No change — `saveUser`/`getUserByEmail` already operate on the full `IUser` object (no password field on it).

---

## Phase 3 — Service layer

All service functions below must return via `outcome.success(...)` / `outcome.failure(...)`, not raw object literals.

### `src/services/register.ts` — done
- Accepts `{ name, email, password }` (`IRegisterInput`, derived from `IUserInput & Pick<ICredential, "password">`).
- Validates `{ name, email }` against `userInputSchema` and `{ email, password }` against `credentialSchema`.
- Creates `Credential` via `createCredential`/`saveCredential`, then `User` via `createUser`/`saveUser`, then a `Session`.
- Returns `outcome.success(session.data)` — just the session, not `{ user, session }`. Client no longer gets the user object back in the register response body; intentional as of this pass.
- Password is stored as plain text (see hashing note above / TECH_DEBT.md).
- Known pre-existing gap (not fixed in this pass, just noting): if session creation fails after the user/credential are saved, the records are orphaned with no session — the JSON-file store has no transactions. Tracked in TECH_DEBT.md along with the equivalent gap in `group.ts`/`task.ts`.

### `src/services/login.ts` — done
- Accepts `{ email, password }` (`ILoginInput`, aliased directly to `ICredential`).
- Looks up `Credential` by email and compares `password` directly (plain text — see TECH_DEBT.md).
- If credential not found **or** password mismatches → the same generic `"Invalid email or password"` failure, so callers can't distinguish the two cases.
- On success, looks up the `User` by email, creates a new session — no invalidation of the user's other sessions.
- Returns `outcome.success(session.data)` — same shape change as `register`.

### `src/services/session.ts`
- `createSession`/`verifiedSession` — done, migrated to `outcome`.
- `refreshSession(sessionId: string)` — done:
  1. Fetch session via `getSession`.
  2. If not found → `outcome.failure`.
  3. If `isSessionActive(session)` is false → `outcome.failure` (no reviving expired sessions).
  4. Else compute `refreshSession` (domain) and persist via `createSession` (repo, upsert).
  5. Return `outcome.success(refreshed session)`.
  - Not idempotent by design: every successful call extends `expiredAt` further from `Date.now()` at call time — repeated calls are safe but each one pushes expiry again, unlike `logout`'s idempotent end-state.

### `src/services/logout.ts` — done
- `logout(sessionId: string)` — looks up the session via `getSession`; if not found, returns `outcome.success(null)` (already logged out — same end state as a successful logout, so it's not treated as an error); otherwise calls `deleteSession` and returns `outcome.success(null)`. Idempotent, per the original decision in §3.

---

## Phase 4 — API layer

### `src/app/api/register/route.ts` — done
- Parses `{ name, email, password }`, calls `register` service, sets the session cookie (`data.id`/`data.expiredAt`) on success.
- Success response now returns `201 Created` (resource creation), fixed as a small follow-up in this pass.
- Still blanket-200s every failure (validation, email-in-use, unexpected exceptions all return `code: 500` in the body but no distinct HTTP status) — proper status-code mapping (400/409/etc.) was not done in this pass; tracked in TECH_DEBT.md.

### `src/app/api/login/route.ts` — done
- Accepts `password` in the request body.
- The raw-`Error`-object leak is fixed: caught values are normalized via `shared/utils/error`'s `getErrorMessage` before being put in the response, so `err.err` is always a string now.
- Still does not map failures to distinct status codes (auth failure, validation, etc. all come back as `code: 500`) — same gap as `register`, tracked in TECH_DEBT.md.

### `src/app/api/logout/route.ts` — done
- Reads the session id from the cookie. If present, calls `logout` service (idempotent, see above). If absent, skips straight to clearing the cookie and responding success — no session cookie is itself treated as "already logged out," not an error.

### `src/app/api/session/refresh/route.ts` — done
- Read session id from cookie, call `refreshSession` service.
- Success → set the cookie with the new `expiredAt`, return the new expiry (`200`).
- Failure (expired or not found) → `401`, clear cookie, front-end redirects to login.
- No cookie present at all → treated as a genuine error (falls into the `catch` block, `200` with `code: 500` in the body) rather than a `401` — same status-code gap as the other routes.

---

## Phase 5 — Front-end

Current state: [login/page.tsx](src/app/(app)/login/page.tsx) is a placeholder with no form; there is no registration page at all. `front-end/features/README.md` documents the intended `auth-login`/`auth-logout` flows but neither is implemented, and it has no entry at all for `auth-register`.

Per the FSD rules in [AGENTS.md](AGENTS.md), this needs two feature slices:
- `src/front-end/features/auth-login/` — login form (email, password), calls `/api/login`, each with a `README.md` describing the flow.
- `src/front-end/features/auth-register/` — registration form (name, email, password), calls `/api/register`. **Not yet documented anywhere.**
- Wire the session-refresh call (interval-based or on-activity — implementation detail to decide when we get here) and logout button into `shared/` layout, since those apply across authenticated pages.

This phase is scoped separately since it wasn't part of the backend decisions above — flag if you want it bundled into the same work or done as a follow-up pass.

---

## Sequencing

1. Domain (`credential.ts` hashing/verification functions — still pending, tracked in TECH_DEBT.md; `session.ts` refresh — done)
2. Repositories (`credential` — done, `deleteSession` — done)
3. Services (`register`, `login` rework for credential split — done; `logout` — done; `session.refreshSession` — done)
4. API routes (`register`, `login`, `logout`, `session/refresh` — all done)
5. Front-end forms + wiring — **not started**
6. Manual verification of each decided behavior:
   - Registering logs the user in immediately, no verification step.
   - Two logins from "different devices" both remain valid sessions simultaneously.
   - Wrong password and unknown email produce the identical error response.
   - Logout removes only the current session; a second session for the same user still works.
   - Refreshing an active session extends `expiredAt`; refreshing an expired session is rejected and forces re-login.

## API documentation

Each route above has a colocated `_docs.json` (e.g. `src/app/api/register/_docs.json`) describing its request/response shape, generated via the `/document-api-route` project command. These are merged into one OpenAPI document served live at `GET /api/openapi`. See [src/docs/README.md](src/docs/README.md) for the full pipeline and the reasoning behind it.

## Out of scope for this pass

- Password reset (parked for later; will need a `PasswordResetToken` entity).
- "Logout of all devices."
- Absolute session lifetime cap.
- Session policy tuning (concurrent session limits, complexity rules beyond min length).
