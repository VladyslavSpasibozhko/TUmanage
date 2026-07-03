# shared/http

Typed HTTP client for all front-end API calls. Wraps the browser `fetch` API, enforces `Content-Type: application/json` on every request, and converts non-2xx responses into a structured `ApiError`.

## Files

| File | Description |
|------|-------------|
| `client.ts` | Exports the `http` object — five methods (`get`, `post`, `put`, `patch`, `del`) that each return `Promise<ApiResponse<T>>` |
| `errors.ts` | Exports `ApiError` — an `Error` subclass with a numeric `code` (HTTP status) |
| `index.ts` | Barrel re-export: `http`, `ApiError` |

## API

### `http`

```ts
import { http } from "@/src/front-end/shared/http";

// GET
const res = await http.get<User[]>("/api/users");

// POST
const res = await http.post<Session>("/api/login", { email });

// PUT / PATCH / DELETE
await http.put<Task>("/api/tasks/1", { title: "Updated" });
await http.patch<Task>("/api/tasks/1", { status: "done" });
await http.del("/api/tasks/1");
```

Every method returns:

```ts
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; err: { code: number; err: string } };
```

### `ApiError`

Thrown when the server responds with a non-2xx status code.

```ts
import { ApiError } from "@/src/front-end/shared/http";

try {
  await http.post("/api/login", {});
} catch (e) {
  if (e instanceof ApiError) {
    console.log(e.code);    // HTTP status, e.g. 401
    console.log(e.message); // HTTP status text, e.g. "Unauthorized"
  }
}
```

## Usage rules

- Always import from the barrel (`shared/http`), not from individual files
- Do not instantiate `ApiError` directly — it is only thrown by the `http` client
- Do not import this module from `shared/` sub-libraries — only `entities/` and `features/` should call it
