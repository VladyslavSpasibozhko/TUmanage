import type { Result } from "./types";

function failure(error: Error): Result<never> {
  return { ok: false, error };
}

export { failure };
