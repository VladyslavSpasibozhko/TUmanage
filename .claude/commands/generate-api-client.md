# /generate-api-client

Generate the front-end `entities/<entity>/api/<verb>.ts` config function(s) for one or more backend API routes under `src/app/api/`.

## When to use

Run this command whenever you:
- Add a new `route.ts` under `src/app/api/` (new endpoint)
- Change an existing route's method, path, or input shape
- Notice a route under `src/app/api/` with no corresponding `entities/*/api/*.ts` config function

## What this command does

For each target route, read its `_docs.json` (run `/document-api-route` first if it's missing or stale), trace the input type back to `src/domain/`, then write one pure config function per HTTP method — following the `entities/ API config functions` rules in `CLAUDE.md`. Do not perform any network calls, and do not touch `gateway/` or `features/`.

---

## Rules

These mirror `CLAUDE.md` — read it first. Summary:

- One function per HTTP method, one file per function: `entities/<entity>/api/<verb>.ts`
- Function name is `<verb>Api`, e.g. `loginApi`, `registerApi`
- Return type is `Pick<IHttpRequest, "method" | "path" | "body">` imported from `@/src/front-end/shared/http` (add `"path"` with a query string instead of `"body"` for `GET` routes with query params)
- `method` and `path` are copied verbatim from the route's `_docs.json` (`method`, `path` fields)
- The function's input parameter type is imported from `src/domain/`, composed via `Pick`/`Omit`/intersection — never hand-rolled. Match it to the same input type the backend service already uses (check `services/<name>.ts` for the type it accepts)
- If the route takes no input (`_docs.json` `input` is `null`), the function takes no parameters
- Body is serialized with `JSON.stringify(input)`; never build the body string by hand

### Picking the target entity folder

- Use the entity whose shape appears in `_docs.json`'s `output` `data` on success — that's what the endpoint is "about" from the client's perspective, not necessarily the entity named in the URL
- If no `entities/<entity>/` folder exists yet for it, create `types.ts` re-exporting the domain type (or just re-export directly from the barrel `index.ts` — do not duplicate fields) and an `api/` subfolder
- Update (or create) `entities/<entity>/index.ts` to barrel-export the domain type and every function under `api/`

---

## Steps to run

1. Identify target route(s): either explicit paths passed as arguments, or every `route.ts` under `src/app/api/` missing a matching `entities/*/api/*.ts`.
2. For each route, read its `_docs.json`. If missing or clearly stale versus `route.ts`, stop and run `/document-api-route` on it first.
3. Read the route's `route.ts` to find the service it calls; read that service to find its input parameter type and the `src/domain/` types it's composed from.
4. Determine the target entity folder per the rule above.
5. Write `entities/<entity>/api/<verb>.ts` with the config function, typed per the rules above.
6. Update `entities/<entity>/index.ts` to export the new type/function.
7. Run `npx tsc --noEmit` and fix any type errors before finishing.

## Output

One `entities/<entity>/api/<verb>.ts` file per targeted route/method, plus updated `entities/<entity>/index.ts` barrels. No changes to `app/api/`, `services/`, `domain/`, `gateway/`, or `features/`.
