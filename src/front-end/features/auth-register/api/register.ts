import client from "@/src/front-end/gateway/httpl-client";
import { registerApi, type IRegisterInput } from "@/src/front-end/entities/user";
import type { ISession } from "@/src/domain/session";

export function register(input: IRegisterInput) {
  return client<ISession>(registerApi(input));
}
