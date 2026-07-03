import { ISession } from "@/src/domain/session";
import { readJson, writeJson } from "./utils";

const documentPath = "src/db/sessions.json";

async function createSession(session: ISession) {
  let sessions = await readJson<Record<string, ISession>>(documentPath);

  if (!sessions) sessions = {};
  sessions[session.id] = session;
  await writeJson(documentPath, sessions);
  return session;
}

async function getSession(id: string) {
  const sessions = await readJson<Record<string, ISession>>(documentPath);
  if (!sessions) return null;
  return sessions[id] ?? null;
}

export { createSession, getSession };
