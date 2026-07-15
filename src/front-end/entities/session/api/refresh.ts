import type { IHttpRequest } from "@/src/front-end/shared/http";

export function refreshSessionApi(): Pick<IHttpRequest, "method" | "path"> {
  return {
    method: "POST",
    path: "/v1/session/refresh",
  };
}
