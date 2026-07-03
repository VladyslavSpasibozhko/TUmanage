import { randomUUID } from "crypto";
import { type PermissionName } from "./permission";

export interface IRolePermission {
  id: string;
  roleId: string;
  permissionId: string;
}

function createRolePermission(roleId: string, permissionId: string): IRolePermission {
  return {
    id: randomUUID(),
    roleId,
    permissionId,
  };
}

function hasPermission(permissionNames: PermissionName[], permission: PermissionName): boolean {
  return permissionNames.includes(permission);
}

export { createRolePermission, hasPermission };
