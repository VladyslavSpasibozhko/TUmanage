import { error } from "@/src/shared/utils";
import type { ErrorStatusCode } from "./types";

function apiError(err: unknown, status: ErrorStatusCode): Response {
  return Response.json(
    { success: false, err: { code: status, err: error.getErrorMessage(err) } },
    { status },
  );
}

export { apiError };
