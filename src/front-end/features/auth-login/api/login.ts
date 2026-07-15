import type { ICredential } from "@/src/domain/credential";
import type { ISession } from "@/src/domain/session";
import client from "@/src/front-end/gateway/httpl-client";
import { loginApi } from "@/src/front-end/entities/session";

export function login(input: ICredential) {
  return client<ISession>(loginApi(input));
}
