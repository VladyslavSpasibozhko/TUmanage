import {
  createSession as saveSession,
  getSession,
} from "@/src/repositories/session";
import { createSession as create, isSessionActive } from "@/src/domain/session";

async function createSession(userId: string) {
  try {
    const session = create(userId);
    await saveSession(session);
    return { ok: true, data: session };
  } catch (err) {
    return { ok: false, error: err };
  }
}

async function verifiedSession(id: string) {
  try {
    const session = await getSession(id);
    if (!session) {
      throw new Error("Session with id " + id + " not found");
    }
    return { ok: true, data: { active: isSessionActive(session) } };
  } catch (err) {
    return { ok: false, error: err };
  }
}

export { createSession, verifiedSession };
