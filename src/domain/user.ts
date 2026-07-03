import { randomUUID } from "crypto";

export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

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

const schema = {
  name: { type: "string", minLength: 2, maxLength: 12 },
  email: {
    type: "string",
    format: "email",
    pattern: "/^[^\s@]+@[^\s@]+\.[^\s@]+$/",
  },
  required: ["email"],
};

export { schema, createUser, updateUser };
