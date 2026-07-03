import { IRole } from "@/src/domain/role";
import { readJson } from "./utils";

const documentPath = "src/db/roles.json";

async function getRole(id: string) {
  const roles = await readJson<Record<string, IRole>>(documentPath);
  if (!roles) return null;
  return roles[id] ?? null;
}

async function getRoleByName(name: string) {
  const roles = await readJson<Record<string, IRole>>(documentPath);
  if (!roles) return null;
  return Object.values(roles).find((r) => r.name === name) ?? null;
}

export { getRole, getRoleByName };
