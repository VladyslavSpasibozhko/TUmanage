import {
  createSession as saveSession,
  getSession,
} from "@/src/repositories/session";
import {
  createSession as create,
  isSessionActive,
  isSessionExpiringSoon,
  refreshSession as refresh,
} from "@/src/domain/session";
import { outcome, error } from "@/src/shared/utils";

async function createSession(userId: string) {
  try {
    const session = create(userId);
    await saveSession(session);
    return outcome.success(session);
  } catch (err) {
    return outcome.failure(error.getErrorMessage(err));
  }
}

async function verifiedSession(id: string) {
  try {
    const session = await getSession(id);
    if (!session) {
      throw new Error("Session with id " + id + " not found");
    }
    return outcome.success({
      active: isSessionActive(session),
      refresh: isSessionExpiringSoon(session),
    });
  } catch (err) {
    return outcome.failure(error.getErrorMessage(err));
  }
}

async function refreshSession(id: string) {
  try {
    const session = await getSession(id);
    if (!session) {
      throw new Error("Session with id " + id + " not found");
    }
    if (!isSessionActive(session)) {
      throw new Error("Session with id " + id + " is expired");
    }
    const refreshed = refresh(session);
    await saveSession(refreshed);
    return outcome.success(refreshed);
  } catch (err) {
    return outcome.failure(error.getErrorMessage(err));
  }
}

export { createSession, verifiedSession, refreshSession };
