# Tech Debt

Tracked items we've deliberately deferred. Reference this file when picking up follow-up work.

## No rollback for multi-write services

Several `src/services/` functions perform more than one `await save*`/`create*`
repository call in sequence, each hitting its own JSON-backed file with no
shared transaction. If an earlier write succeeds and a later one throws, the
earlier write is never undone — leaving orphaned/partial state.

Affected today:
- `register.ts` — `saveCredential` → `saveUser` → `createSession`
- `group.ts` (`createGroupWithAdmin`) — `saveGroup` → `saveGroupMember`
- `task.ts` (`createTaskForGroup`) — `saveTask` → `saveTaskAssignee` → `saveTaskGroup`

Fix: compensating rollback (saga-style) for each of these — add the missing
`delete*` repository functions, and on failure of a later step, undo the
earlier steps' writes (in reverse order) before returning the failure. Worth
factoring into a shared helper once the pattern is implemented more than
once, rather than hand-rolling it per service.

## No translations for backend services

`src/shared/i18n/` (`Translator`, `ITranslator`, `TranslationProvider`) exists
but `Translator.t()` is a stub that just returns the key unchanged, and
nothing in `src/services/` uses it. Service-layer failure messages
(`outcome.failure("Invalid email format")`, `"Email already in use"`, etc.)
are hardcoded English strings.

Fix: wire services to accept/use an `ITranslator` (or a locale) and route
failure messages through translation keys instead of literal strings.

## Passwords are stored and compared in plain text

`AUTH_PLAN.md` originally called for `hashPassword`/`verifyPassword` in
`domain/credential` (Node's `crypto.scrypt` with a per-password salt). What
actually shipped: `repositories/credential.ts` writes `ICredential.password`
as-is to `credentials.json`, and `services/login.ts` compares it with
`credential.password !== password`. Any read access to the credentials file
(or a backup/leak of it) exposes every password directly.

Fix: add `hashPassword`/`verifyPassword` to `domain/credential`, hash in
`register.ts` before `createCredential`/`saveCredential`, and compare via
`verifyPassword` in `login.ts` instead of a direct string comparison.

## API routes collapse every failure to HTTP 500

`app/api/login`, `app/api/register`, and `app/api/logout` all catch every
failure — validation errors, "email already in use", auth failures, expired
sessions, genuine server errors — and respond with the same
`{ success: false, err: { code: 500, ... } }` shape. Clients can't
distinguish "bad input" from "server broke" from the status code alone, and
have to parse the `err` message string instead.

Fix: map known `outcome.failure` cases to proper status codes (400 for
validation, 401 for auth failures, 409 for email-already-in-use, etc.) and
reserve 500 for the actual `catch` block (unexpected exceptions).

## generate-openapi.mjs mixes discovery, transform, and I/O with no contract

`scripts/generate-openapi.mjs` is a single flat file: filesystem discovery
(`findDocsFiles` walking `app/api` for a magic `_docs.json` filename),
pure transform logic (`versionOf`, `toOperation`, `toOpenApiResponses`,
`addToPaths`, `groupByVersion`), and output (`writeFileSync`) are all
interleaved in `build()`. The pure transform functions can't be unit tested
without going through the filesystem, and there's no documented shape for
what a `_docs.json` entry must look like — route authors have to
reverse-engineer it from `toOperation`. The only piece actually coupled to
Next.js/folder conventions is `findDocsFiles`; the rest only depends on the
JSON entry shape.

Fix: name the entry shape explicitly (e.g. a `DocsEntry` JSDoc typedef —
`path`, `method`, `title`, `description`, `input`, `output`) as the contract
between discovery and transform. Split into `transform/` (pure, one function
per file with colocated tests per the `utils/` convention) and `io/`
(`findDocsFiles`, `writeOpenApiDocs`), with `build.mjs` wiring them together.
This isolates the framework-coupled part to `io/findDocsFiles.mjs` so a
future framework migration only requires swapping that one file.
