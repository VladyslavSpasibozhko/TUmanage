import { ICredential } from "@/src/domain/credential";
import { readJson, writeJson } from "./utils";

const documentPath = "src/db/credentials.json";

async function saveCredential(credential: ICredential) {
  let credentials = await readJson<Record<string, ICredential>>(documentPath);
  if (!credentials) credentials = {};
  credentials[credential.email] = credential;
  await writeJson(documentPath, credentials);
  return credential;
}

async function getCredentialByEmail(email: string) {
  const credentials = await readJson<Record<string, ICredential>>(documentPath);
  if (!credentials) return null;
  return credentials[email] ?? null;
}

export { saveCredential, getCredentialByEmail };
