import type { SuccessStatusCode } from "./types";

function apiSuccess<T>(data: T, status: SuccessStatusCode = 200): Response {
  return Response.json({ success: true, data }, { status });
}

export { apiSuccess };
