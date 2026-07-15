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
3. Find every `validate(xSchema, { ... })` call inside that service function body — these are the actual schemas (from `src/domain/<entity>/schema.ts`) the service validates the input against (e.g. `credentialSchema`, `userInputSchema`).
4. Build `input` as a reference to those schema(s) — see "Referencing domain schemas" below. Never reconstruct their `properties`/`required` by hand from the TypeScript type or from memory.
5. If the service validates against multiple schemas covering different fields (e.g. `register` validates `credentialSchema` for `email`/`password` and `userInputSchema` for `name`/`email`), reference both with `allOf` rather than merging their fields into a new hand-built object.

### Deriving `output` (response schema) — do NOT reuse the service's return type

1. Ignore the service's `Result<T>` / `outcome.success`/`outcome.failure` shape entirely — it is not what the client receives.
2. Read the route handler's own literal `Response.json({...}, ...)` calls (both the success branch and the `catch`/failure branch(es)).
3. Build one JSON Schema entry per distinct HTTP status code actually returned (default to `200` if no `status` option is passed to `Response.json`).
4. Each entry reflects exactly the object literal passed to `Response.json` at that call site (e.g. `{ success: true, data }`, `{ success: false, err: { code, err } }`). The literal envelope (`success`, `err.code`, `err.err`, etc.) is written directly as JSON Schema. Any field that holds a domain entity (e.g. `data` holding an `ISession`) is a reference — see below — never an inlined copy of that entity's shape.

### Referencing domain schemas — never copy, never reconstruct

`src/domain/<entity>/schema.ts` is the only place a schema's shape is allowed to exist. `_docs.json` must point at it, not repeat it.

- Reference format: `{ "$ref": "@/src/domain/<entity>/schema.ts#<exportName>" }`, e.g. `{ "$ref": "@/src/domain/credential/schema.ts#credentialSchema" }` — the same `@/` alias already used for TS imports throughout this repo (see `tsconfig.json` `paths`), so the path is instantly recognizable and greppable.
- One `$ref` per schema the service actually validates against. If a service validates more than one schema for one input, combine them with `allOf`:
  ```json
  "input": {
    "allOf": [
      { "$ref": "@/src/domain/credential/schema.ts#credentialSchema" },
      { "$ref": "@/src/domain/user/schema.ts#userInputSchema" }
    ]
  }
  ```
- Never write a raw `"properties"`/`"required"` object for anything that already has a named schema in `src/domain/`. If you catch yourself typing out field definitions that mirror a domain schema, stop — reference it instead.
- It is fine (and expected) for `_docs.json` to not be resolvable standalone by a generic JSON Schema validator — resolving these `$ref`s into real inlined schemas for external consumers is `scripts/generate-openapi.mjs`'s job at bundle time, not something to do by hand here.

### Required top-level shape

```json
{
  "title": "Human-readable name for the endpoint",
  "path": "/v1/register",
  "method": "POST",
  "description": "One or two sentences: what this endpoint does, in business terms.",
  "input": {
    "allOf": [
      { "$ref": "@/src/domain/credential/schema.ts#credentialSchema" },
      { "$ref": "@/src/domain/user/schema.ts#userInputSchema" }
    ]
  },
  "output": {
    "201": {
      "type": "object",
      "properties": {
        "success": { "const": true },
        "data": { "$ref": "@/src/domain/session/schema.ts#sessionSchema" }
      },
      "required": ["success", "data"],
      "additionalProperties": false
    },
    "500": { "...envelope written directly, per Deriving output above...": true }
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
7. Verify: every HTTP method exported by `route.ts` has a corresponding entry; every distinct status code returned by the route appears in `output`; no domain entity's fields were reconstructed by hand anywhere in `input`/`output` — grep the file for `"properties"` and confirm each hit is either the literal response envelope or sits inside a `$ref` target, never a copy of a `src/domain/*/schema.ts` shape.

## Output

One `_docs.json` per targeted route folder. No changes to `.ts` files.
