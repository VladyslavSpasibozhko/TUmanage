import {
  createSession as saveSession,
  getSession,
} from "@/src/repositories/session";
import { createSession as create, isSessionActive } from "@/src/domain/session";
import { outcome } from "@/src/shared/utils";

async function createSession(userId: string) {
  try {
    const session = create(userId);
    await saveSession(session);
    return outcome.success(session);
  } catch (err) {
    return outcome.failure(err instanceof Error ? err : new Error(String(err)));
  }
}

async function verifiedSession(id: string) {
  try {
    const session = await getSession(id);
    if (!session) {
      throw new Error("Session with id " + id + " not found");
    }
    return outcome.success({ active: isSessionActive(session) });
  } catch (err) {
    return outcome.failure(err instanceof Error ? err : new Error(String(err)));
  }
}

export { createSession, verifiedSession };
