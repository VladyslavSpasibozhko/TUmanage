import { randomUUID } from "crypto";
import type { IRolePermission } from "./types";

function createRolePermission(
  roleId: string,
  permissionId: string,
): IRolePermission {
  return {
    id: randomUUID(),
    roleId,
    permissionId,
  };
}

function hasPermission(permissionNames: string[], permission: string): boolean {
  return permissionNames.includes(permission);
}

export * from "./types";
export * from "./schema";
export { createRolePermission, hasPermission };
