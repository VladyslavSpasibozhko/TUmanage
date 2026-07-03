import { randomUUID } from "crypto";
import { hasPermission } from "../role-permission";
import type { IGroupMember } from "./types";

function createGroupMember(
  groupId: string,
  userId: string,
  roleId: string,
): IGroupMember {
  return {
    id: randomUUID(),
    groupId,
    userId,
    roleId,
    createdAt: Date.now(),
  };
}

function changeMemberRole(
  member: IGroupMember,
  newRoleId: string,
): IGroupMember {
  return { ...member, roleId: newRoleId };
}

function canDo(permissionNames: string[], permission: string): boolean {
  return hasPermission(permissionNames, permission);
}

export * from "./types";
export * from "./schema";
export { createGroupMember, changeMemberRole, canDo };
