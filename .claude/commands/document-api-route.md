# /document-api-route

Generate or update the `_docs.json` file for one or more API routes under `src/app/api/`.

## When to use

Run this command whenever you:
- Add a new `route.ts` file (new endpoint)
- Add or remove an HTTP method export (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) in an existing `route.ts`
- Change the service a route calls, or that service's input type
- Change the shape of a route's `Response.json(...)` calls (new field, new status code, new error case)

## What this command does

For each target `route.ts`, read the file and its dependencies, then write or update a sibling `_docs.json` in the same folder. Do not modify `route.ts` or any other source file — documentation only.

---

## Rules

### File location and name

- Always `_docs.json`, colocated in the same directory as the `route.ts` it documents (e.g. `src/app/api/v1/register/route.ts` → `src/app/api/v1/register/_docs.json`).
- One `_docs.json` per route folder, covering every HTTP method exported from that folder's `route.ts`.

### Deriving `path`

- Build the URL path from the route's location under `src/app/api/`: strip route-group segments `(group)`, keep dynamic segments (`[id]`) as-is, do not prefix with `/api`.

### Deriving `input` (request schema) — do NOT skip steps

1. Find the service function the route handler calls (e.g. `register(...)` in `app/api/v1/register/route.ts`).
2. Open that service file and find its parameter type (e.g. `IRegisterInput` in `services/register.ts`).
3. Find every `validate(xSchema, { ... })` call inside that service function body — these are the actual JSON Schemas the service validates the input against (e.g. `credentialSchema`, `userInputSchema`).
4. Build `input` as a JSON Schema object whose `properties`/`required`/`additionalProperties` are assembled from those validated schemas' fields — not from the TypeScript type directly, and not hand-invented.
5. If the service validates against multiple schemas covering different fields (e.g. `register` validates `credentialSchema` for `email`/`password` and `userInputSchema` for `name`/`email`), merge their fields into one combined `input` schema, de-duplicating overlapping fields (e.g. `email` appears in both).

### Deriving `output` (response schema) — do NOT reuse the service's return type

1. Ignore the service's `Result<T>` / `outcome.success`/`outcome.failure` shape entirely — it is not what the client receives.
2. Read the route handler's own literal `Response.json({...}, ...)` calls (both the success branch and the `catch`/failure branch(es)).
3. Build one JSON Schema entry per distinct HTTP status code actually returned (default to `200` if no `status` option is passed to `Response.json`).
4. Each entry reflects exactly the object literal passed to `Response.json` at that call site (e.g. `{ success: true, data }`, `{ success: false, err: { code, err } }`), with `data`'s shape inlined from whatever domain type it actually holds (e.g. `ISession` → inline `sessionSchema`'s fields).

### Inlining, not referencing

- Copy the relevant domain schema's `properties`/`required`/`additionalProperties` directly into `input`/`output` — do not use `$ref` pointers back to `src/domain/`. Each `_docs.json` must be readable standalone.

### Required top-level shape

```json
{
  "title": "Human-readable name for the endpoint",
  "path": "/v1/register",
  "method": "POST",
  "description": "One or two sentences: what this endpoint does, in business terms.",
  "input": { "...JSON Schema...": true },
  "output": {
    "200": { "...JSON Schema...": true },
    "500": { "...JSON Schema...": true }
  }
}
```

If a route folder exports more than one HTTP method, use an array of these objects instead of a single object.

---

## Steps to run

1. Read the target `route.ts`.
2. Trace to the service(s) it calls; read the service file(s).
3. Trace to the domain schema(s) the service validates against; read the domain `schema.ts` file(s).
4. Assemble `input` per the rules above.
5. Re-read the route's own `Response.json(...)` call sites; assemble `output` per the rules above.
6. Write `_docs.json` next to `route.ts`.
7. Verify: every HTTP method exported by `route.ts` has a corresponding entry; every distinct status code returned by the route appears in `output`; no field in `input`/`output` was invented rather than traced from actual code.

## Output

One `_docs.json` per targeted route folder. No changes to `.ts` files.
