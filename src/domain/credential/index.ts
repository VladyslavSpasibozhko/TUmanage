import type { ICredential } from "./types";

function createCredential(email: string, password: string): ICredential {
  return { email, password };
}

function updateCredential(
  credential: ICredential,
  changes: Partial<Pick<ICredential, "password">>,
): ICredential {
  return { ...credential, ...changes };
}

export * from "./types";
export * from "./schema";
export { createCredential, updateCredential };
