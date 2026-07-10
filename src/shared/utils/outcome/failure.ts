import type { Result } from "./types";

function failure(error: string): Result<never> {
  return { ok: false, error };
}

export { failure };
