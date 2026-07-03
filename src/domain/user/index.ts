import { randomUUID } from "crypto";
import type { IUser } from "./types";

function createUser(name: string, email: string): IUser {
  return {
    id: randomUUID(),
    name,
    email,
    createdAt: Date.now(),
  };
}

function updateUser(
  user: IUser,
  updates: Partial<Pick<IUser, "name" | "email">>,
): IUser {
  return { ...user, ...updates };
}

export * from "./types";
export * from "./schema";
export { createUser, updateUser };
