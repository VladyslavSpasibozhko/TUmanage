import { IUser } from "@/src/domain/user";
import { readJson, writeJson } from "./utils";

const documentPath = "src/db/users.json";

async function saveUser(user: IUser) {
  let users = await readJson<Record<string, IUser>>(documentPath);
  if (!users) users = {};
  users[user.id] = user;
  await writeJson(documentPath, users);
  return user;
}

async function getUser(id: string) {
  const users = await readJson<Record<string, IUser>>(documentPath);
  if (!users) return null;
  return users[id] ?? null;
}

async function getUserByEmail(email: string) {
  const users = await readJson<Record<string, IUser>>(documentPath);
  if (!users) return null;
  return Object.values(users).find((u) => u.email === email) ?? null;
}

export { saveUser, getUser, getUserByEmail };
