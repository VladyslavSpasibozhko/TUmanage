import type { ICredential } from "@/src/domain/credential";
import type { IHttpRequest } from "@/src/front-end/shared/http";

export function loginApi(
  input: ICredential,
): Pick<IHttpRequest, "method" | "path" | "body"> {
  return {
    method: "POST",
    path: "/v1/login",
    body: JSON.stringify(input),
  };
}
