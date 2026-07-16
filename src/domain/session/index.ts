import { randomUUID } from "crypto";
import type { ISession } from "./types";

const SESSION_LIFETIME_MS = 1000 * 60 * 60;
const SESSION_REFRESH_THRESHOLD_MS = 1000 * 60 * 5;

function createSession(userId: string): ISession {
  return {
    id: randomUUID(),
    userId,
    expiredAt: Date.now() + SESSION_LIFETIME_MS,
  };
}

function isSessionActive(session: ISession): boolean {
  return Date.now() < session.expiredAt;
}

function isSessionExpiringSoon(session: ISession): boolean {
  return session.expiredAt - Date.now() < SESSION_REFRESH_THRESHOLD_MS;
}

function refreshSession(session: ISession): ISession {
  return { ...session, expiredAt: Date.now() + SESSION_LIFETIME_MS };
}

export * from "./types";
export * from "./schema";
export {
  createSession,
  isSessionActive,
  isSessionExpiringSoon,
  refreshSession,
};
