import { IPermission } from "@/src/domain/permission";
import { readJson } from "./utils";

const documentPath = "src/db/permissions.json";

async function getPermission(id: string) {
  const permissions = await readJson<Record<string, IPermission>>(documentPath);
  if (!permissions) return null;
  return permissions[id] ?? null;
}

async function getAllPermissions() {
  const permissions = await readJson<Record<string, IPermission>>(documentPath);
  return permissions ? Object.values(permissions) : [];
}

export { getPermission, getAllPermissions };
