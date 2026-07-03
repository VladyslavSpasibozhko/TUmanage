import { randomUUID } from "crypto";

interface ISession {
  id: string;
  userId: string;
  expiredAt: number;
}

const SESSION_LIFETIME_MS = 1000 * 60 * 60;

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

export { createSession, isSessionActive, type ISession };
