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

- `domain/credential/` — `ICredential { email: string; password: string }` (password stored as a hash, despite the field name), `credentialSchema` (email + password, min length 8). No domain functions yet — `hashPassword`/`verifyPassword` still need to be added here.
- `repositories/credential.ts` — `saveCredential`, `getCredentialByEmail`. Backed by `src/db/credentials.json`.

`register` now does two separate saves: a `User` (profile) and a `Credential` (email + password hash). `login` looks up the `Credential` by email to verify the password, then looks up the `User` by email to build the session.

## Note on domain folder structure

`domain/user/`, `domain/session/`, and `domain/credential/` are folders (`types.ts`, `schema.ts`, `index.ts` barrel), not single flat files as earlier drafts of this plan assumed. New domain entities should follow this same three-file pattern.

## New convention: `services/` must use `shared/utils/outcome`

Every service function returns `success(data)` or `failure(error)` from `src/shared/utils/outcome` (barrel: `import { outcome } from "@/src/shared/utils"`) instead of hand-writing `{ ok, data, error }` object literals. This is a project-wide convention now, not specific to auth — `login`, `register`, `session`, `task`, and `group` services have already been migrated.

`Result<T>` (`{ ok: true; data: T } | { ok: false; error: Error }`) is defined in `shared/utils/outcome/types.ts`.

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
- `index.ts` — currently just barrels `types`/`schema`. Still needed:
  - `validatePassword(password: string): boolean` — length check.
  - `hashPassword(password: string): string` — `crypto.scryptSync` + random salt, returned as a single encoded string (e.g. `salt:hash`).
  - `verifyPassword(password: string, hash: string): boolean` — recompute hash with the stored salt, constant-time compare (`crypto.timingSafeEqual`).
  - A `loginInputSchema`/credential-check schema (email + password) — reuse `credentialSchema`'s `$defs` rather than duplicating field definitions.

### `src/domain/session/`
- Add `refreshSession(session: ISession): ISession` — pure function, returns `{ ...session, expiredAt: Date.now() + SESSION_LIFETIME_MS }`. Does not itself check `isSessionActive` — that check happens where the decision is made (service layer), keeping this function a simple transformation. **Not yet implemented.**

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

### `src/services/register.ts` — **needs rework, currently broken**
- Accept `password`. Validate via `domain/credential`'s `validatePassword`, hash via `hashPassword`.
- Create `User` via `createUser({ name, email })` (no password arg) and save it.
- Create `Credential` via `saveCredential({ email, password: hash })`.
- Known pre-existing gap (not fixed in this pass, just noting): if session creation fails after the user/credential are saved, the records are orphaned with no session — the JSON-file store has no transactions. Acceptable for now.

### `src/services/login.ts` — **needs rework, currently broken**
- Accept `password`. Look up `Credential` by email via `getCredentialByEmail`.
- If credential not found **or** password fails `verifyPassword` → return the same generic error (identical message/shape) so callers can't distinguish the two cases.
- On success, look up the `User` by email, create a new session same as today — no invalidation of the user's other sessions.

### `src/services/session.ts`
- `createSession`/`verifiedSession` — done, migrated to `outcome`.
- Add `refreshSession(sessionId: string)` — **not yet implemented**:
  1. Fetch session via `getSession`.
  2. If not found → `outcome.failure`.
  3. If `isSessionActive(session)` is false → `outcome.failure` (no reviving expired sessions).
  4. Else compute `refreshSession` (domain) and persist via `createSession` (repo, upsert).
  5. Return `outcome.success(session)`.

### `src/services/logout.ts` (new) — **not yet implemented**
- `logout(sessionId: string)` — calls `deleteSession(sessionId)`. Idempotent: succeeds even if the session was already gone. Return via `outcome`.

---

## Phase 4 — API layer

### `src/app/api/register/route.ts` (new — doesn't exist today)
- Parse `{ name, email, password }`, call `register` service, set session cookie on success.
- Map errors to proper status codes (400 validation, 409 email-in-use) instead of the blanket 500 pattern currently in `login/route.ts`.

### `src/app/api/login/route.ts` (update)
- Accept `password` in the request body.
- On failure, respond with the generic message and 401 — **do not** serialize the raw `Error` object back to the client (current code does `err: { code: 500, err: err }`, which leaks internal error text; fix as part of this change).

### `src/app/api/logout/route.ts` (implement — currently empty)
- Read session id from the cookie, call `logout` service, clear the cookie, respond success regardless of whether the session existed (idempotent per the use-case doc).

### `src/app/api/session/refresh/route.ts` (new)
- Read session id from cookie, call `refreshSession` service.
- Success → set the cookie with the new `expiredAt`, return the new expiry.
- Failure (expired or not found) → 401, clear cookie, front-end redirects to login.

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

1. Domain (`credential.ts` hashing/verification functions, `session.ts` refresh)
2. Repositories (`credential` — done, `deleteSession` — done)
3. Services (`register`, `login` rework for credential split; `logout`, `session.refreshSession` new)
4. API routes (`register`, `login` update, `logout` implement, `session/refresh` new)
5. Front-end forms + wiring
6. Manual verification of each decided behavior:
   - Registering logs the user in immediately, no verification step.
   - Two logins from "different devices" both remain valid sessions simultaneously.
   - Wrong password and unknown email produce the identical error response.
   - Logout removes only the current session; a second session for the same user still works.
   - Refreshing an active session extends `expiredAt`; refreshing an expired session is rejected and forces re-login.

## Out of scope for this pass

- Password reset (parked for later; will need a `PasswordResetToken` entity).
- "Logout of all devices."
- Absolute session lifetime cap.
- Session policy tuning (concurrent session limits, complexity rules beyond min length).
