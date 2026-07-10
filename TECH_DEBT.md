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
