# gateway/

Composed, wired HTTP clients — built from `shared/http` primitives but configured with the app's actual base URL, headers, and (eventually) an auth-refresh interceptor. This is the only layer besides `features/` allowed to have side effects (network calls).

## Files

| File | Description |
|------|-------------|
| `httpl-client/index.ts` | The singleton client, wired via `shared/http`'s `createClient` with `config.apiUrl` as the base URL. Default-exports `instance.request`. |

## Usage

```ts
import client from "@/src/front-end/gateway/httpl-client";
import { loginApi } from "@/src/front-end/entities/session";
import type { ISession } from "@/src/domain/session";

export function login(input: ICredential) {
  return client<ISession>(loginApi(input));
}
```

## Usage rules

- Import the wired client as `client` at the call site — not `httpClient`/`apiClient`. The module's whole purpose is being *the* HTTP client, so a redundant prefix adds noise.
- May type against `entities/` and `domain/` shapes but must not contain business rules (validation, workflow decisions) — only technical wiring
- `features/api/*.ts` files call `client(...)` directly; nothing above `gateway/` should import `shared/http` directly
