import { randomUUID } from "crypto";
import type { IUser, IUserInput } from "./types";

function createUser({ email, name }: IUserInput): IUser {
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
