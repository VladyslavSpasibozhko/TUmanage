import { IRolePermission } from "@/src/domain/role-permission";
import { IPermission } from "@/src/domain/permission";
import { readJson } from "./utils";

const rolePermissionPath = "src/db/role-permissions.json";
const permissionPath = "src/db/permissions.json";

async function getRolePermissions(roleId: string): Promise<IRolePermission[]> {
  const all = await readJson<Record<string, IRolePermission>>(rolePermissionPath);
  if (!all) return [];
  return Object.values(all).filter((rp) => rp.roleId === roleId);
}

async function getPermissionNamesByRole(roleId: string) {
  const rolePermissions = await getRolePermissions(roleId);
  const allPermissions = await readJson<Record<string, IPermission>>(permissionPath);
  if (!allPermissions) return [];

  return rolePermissions
    .map((rp) => allPermissions[rp.permissionId]?.name)
    .filter(Boolean);
}

export { getRolePermissions, getPermissionNamesByRole };
