---
name: write-api-route
description: Write or update a Next.js route.ts under src/app/api/ that wires an existing service into the presentation layer. Triggers automatically on requests like "write/generate/create an api route for X", "add an endpoint for X", "expose X as an api route".
---

# write-api-route

Writes a single `route.ts` (plus its `_docs.json`) that wires an **existing** `services/` function
into `src/app/api/`. This skill does not create domain entities, repositories, or services — if the
service the route needs doesn't exist yet, stop and tell the user which service is missing instead of
inventing one.

## Before writing anything

1. Identify the service function the route should call. Read it in full: its input type, every
   `outcome.success` / `outcome.failure` path, and any nested calls that can throw.
2. Read `src/app/api/_response/types.ts` for the current `SuccessStatusCode` / `ErrorStatusCode`
   unions, and `src/app/api/_response/index.ts` for `apiSuccess` / `apiError`.
3. Read one or two existing routes under `src/app/api/v1/` (e.g. `login/route.ts`,
   `session/refresh/route.ts`) to match current style — do not deviate from it without a reason.
4. If the route needs a status code not already in `_response/types.ts` (e.g. `403`, `404`, `409`),
   **stop and confirm with the user before adding it.** Only extend the union after they agree; then
   add the code to the appropriate union in `types.ts` (nowhere else).

## Route shape rules

- One `route.ts` per folder under `src/app/api/`, colocated with its `_docs.json`. Folder path =
  URL path (strip route groups, keep `[param]` segments, no `/api` prefix — same rule
  `/document-api-route` uses).
- Every exported HTTP method wraps its body in try/catch:
  ```ts
  export async function POST(request: Request) {
    try {
      // parse input, call the service, map result -> Response
    } catch (err) {
      return apiError(err, 500);
    }
  }
  ```
- **POST / PUT / PATCH**: parse body with `await request.json()`, destructure only the fields the
  service needs.
- **GET with query params**: type the handler's first argument as `NextRequest` (from
  `next/server`) and read `request.nextUrl.searchParams.get(...)` — do not hand-parse the URL string.
- **Dynamic segments**: second argument is
  `{ params }: { params: Promise<{ <segment>: string }> }`; `await params` before use (Next's
  `params` is a promise in this version — see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`).
- **Cookies**: only `app/api/` may touch `cookies()` from `next/headers`. Reading/setting/deleting
  the `session` cookie belongs in the route (see `login/route.ts`, `session/refresh/route.ts`), never
  in a service.

## Mapping service results to responses

- Default: `if (!result.ok) return apiError(result.error, 400);` — a service's `outcome.failure(...)`
  is a validation/business-rule failure, which is a 400 unless the route has a specific reason to
  say otherwise.
- If the route itself detects a distinct condition before or after calling the service — e.g. no
  `session` cookie present, or a cookie value that doesn't resolve to anything — check for it
  explicitly in the route and return the appropriate code for that specific condition (`401`/`403`),
  the way `session/refresh/route.ts` returns `401` when the cookie is missing. Do not invent a
  string-matching layer that parses the service's error message to guess a status code — if the
  service needs to communicate more than one failure *kind*, that's a service-layer typed-error
  change, out of scope for this skill.
- Success: `return apiSuccess(data, status)` — `status` defaults to `200`; use `201` only for
  resource creation, matching the `SuccessStatusCode` union.

## After writing the route

Invoke the `document-api-route` skill against the new/changed route folder so `_docs.json` is
generated or updated in the same pass — never leave a route undocumented.

## Out of scope (say so, don't improvise)

- Creating or modifying `domain/`, `repositories/`, or `services/` files.
- Deriving a request-scoped authenticated user (beyond checking whether the `session` cookie is
  present) for permission-gated routes — routes like task/group mutations need that wired at the
  service layer first.
- Adding new HTTP status codes to `_response/types.ts` without the user's explicit go-ahead.
