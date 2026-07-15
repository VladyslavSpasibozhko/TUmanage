import type { ICredential } from "@/src/domain/credential";
import type { IUserInput } from "@/src/domain/user";
import type { IHttpRequest } from "@/src/front-end/shared/http";

export type IRegisterInput = IUserInput & Pick<ICredential, "password">;

export function registerApi(
  input: IRegisterInput,
): Pick<IHttpRequest, "method" | "path" | "body"> {
  return {
    method: "POST",
    path: "/v1/register",
    body: JSON.stringify(input),
  };
}
