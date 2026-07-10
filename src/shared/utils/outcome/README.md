# shared/utils/outcome

A uniform return shape for `services/` functions. Replaces hand-written `{ ok, data, error }` object literals with two factory functions, so every service returns the same discriminated union.

## Files

| File | Description |
|------|-------------|
| `types.ts` | `Result<T>` — `{ ok: true; data: T } \| { ok: false; error: string }` |
| `success.ts` | `success<T>(data: T): Result<T>` |
| `failure.ts` | `failure(error: string): Result<never>` |
| `index.ts` | Barrel re-export of all of the above |

## Usage

```ts
import { outcome } from "@/src/shared/utils";

async function login(email: string, password: string) {
  try {
    const credential = await getCredentialByEmail(email);
    if (!credential) {
      return outcome.failure("Invalid email or password");
    }
    // ...
    return outcome.success({ user, session });
  } catch (err) {
    return outcome.failure(err instanceof Error ? err.message : String(err));
  }
}
```

## Usage rules

- Every function in `src/services/` must return `outcome.success(...)` or `outcome.failure(...)` — no raw `{ ok, data, error }` literals
- `failure` always takes a `string`, not `unknown` — wrap caught values with `err instanceof Error ? err.message : String(err)` before passing them in
- Import via the `shared/utils` barrel (`import { outcome } from "@/src/shared/utils"`), not directly from `shared/utils/outcome`
