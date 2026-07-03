# Auth Implementation Plan

Implementation plan for the Auth flows only (Registration, Login, Logout, Session Refresh). Password Reset is explicitly deferred. This plan follows the layered architecture in [CLAUDE.md](CLAUDE.md) — changes flow `domain/` → `repositories/` → `services/` → `app/api/` → front-end.

---

## Decisions this plan implements

1. **Registration** — `User` gets a real password field. Email verification is not required (user is logged in immediately after registering).
2. **Login** — Multiple concurrent sessions per user are allowed (logging in on a new device does not invalidate existing sessions). Failure responses are generic ("Invalid email or password") regardless of whether the email exists or the password is wrong.
3. **Logout** — Ends only the current session (the one in the request's cookie), not all sessions for the user.
4. **Session Expiration** — A refresh endpoint extends `expiredAt` on an active session. Expired sessions cannot be refreshed — user must log in again.
5. **Password Reset** — Out of scope. Not designed or stubbed in this pass.

## Defaults assumed for this plan (flag if wrong, otherwise proceeding)

- Password policy: minimum 8 characters, no complexity rules (can tighten later).
- Hashing: Node's built-in `crypto.scrypt` with a per-password random salt — no new dependency needed.
- No cap on concurrent sessions per user.
- No absolute session lifetime ceiling (a session refreshed forever never fully expires) — flagged as future hardening, not blocking.
- No "logout of all devices" action in this pass.
- Refresh trigger (automatic on activity vs. manual button) is a front-end decision made in Phase 5, not baked into the endpoint itself — the endpoint just does one thing: extend expiry if the session is currently active.

---

## Phase 1 — Domain layer (pure logic, no I/O beyond existing `crypto` usage)

### `src/domain/user.ts`
- Add `passwordHash: string` to `IUser`.
- `createUser(name, email, passwordHash)` — signature gains `passwordHash`.
- Add `validatePassword(password: string): boolean` — length check, mirrors `validateEmail`.
- Add `hashPassword(password: string): string` — `crypto.scryptSync` + random salt, returned as a single encoded string (e.g. `salt:hash`).
- Add `verifyPassword(password: string, passwordHash: string): boolean` — recompute hash with the stored salt, constant-time compare (`crypto.timingSafeEqual`).

### `src/domain/session.ts`
- Add `refreshSession(session: ISession): ISession` — pure function, returns `{ ...session, expiredAt: Date.now() + SESSION_LIFETIME_MS }`. Does not itself check `isSessionActive` — that check happens where the decision is made (service layer), keeping this function a simple transformation.

---

## Phase 2 — Repository layer

### `src/repositories/session.ts`
- Add `deleteSession(id: string): Promise<void>` — needed for logout (doesn't exist today).
- `createSession(session)` already upserts by id (`sessions[session.id] = session`), so it can be reused to persist a refreshed session as-is — no new save function needed, just call it again after `refreshSession`.

### `src/repositories/user.ts`
- No change — `saveUser`/`getUserByEmail` already operate on the full `IUser` object, which will now include `passwordHash`.

---

## Phase 3 — Service layer

### `src/services/register.ts`
- Accept `password`. Validate via `validatePassword`, hash via `hashPassword`, pass hash to `createUser`.
- Known pre-existing gap (not fixed in this pass, just noting): if session creation fails after the user is saved, the user record is orphaned with no session — the JSON-file store has no transactions. Acceptable for now.

### `src/services/login.ts`
- Accept `password`. Look up user by email.
- If user not found **or** password fails `verifyPassword` → return the same generic error (identical message/shape) so callers can't distinguish the two cases.
- On success, create a new session same as today — no invalidation of the user's other sessions.

### `src/services/session.ts`
- Add `refreshSession(sessionId: string)`:
  1. Fetch session via `getSession`.
  2. If not found → error.
  3. If `isSessionActive(session)` is false → error (no reviving expired sessions).
  4. Else compute `refreshSession` (domain) and persist via `createSession` (repo, upsert).
  5. Return updated session.

### `src/services/logout.ts` (new)
- `logout(sessionId: string)` — calls `deleteSession(sessionId)`. Idempotent: succeeds even if the session was already gone.

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

Current state: [login/page.tsx](src/app/(app)/login/page.tsx) is a placeholder with no form; there is no registration page at all.

Per the FSD rules in [AGENTS.md](AGENTS.md), this needs two feature slices:
- `src/front-end/features/auth-login/` — login form (email, password), calls `/api/login`, each with a `README.md` describing the flow.
- `src/front-end/features/auth-register/` — registration form (name, email, password), calls `/api/register`.
- Wire the session-refresh call (interval-based or on-activity — implementation detail to decide when we get here) and logout button into `shared/` layout, since those apply across authenticated pages.

This phase is scoped separately since it wasn't part of the backend decisions above — flag if you want it bundled into the same work or done as a follow-up pass.

---

## Sequencing

1. Domain (`user.ts`, `session.ts`)
2. Repositories (`deleteSession`)
3. Services (`register`, `login`, `logout`, `session.refreshSession`)
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
