import type { Result } from "./types";

function success<T>(data: T): Result<T> {
  return { ok: true, data };
}

export { success };
