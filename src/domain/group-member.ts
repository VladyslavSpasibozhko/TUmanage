import { randomUUID } from "crypto";
import { type PermissionName } from "./permission";
import { hasPermission } from "./role-permission";

export interface IGroupMember {
  id: string;
  groupId: string;
  userId: string;
  roleId: string;
  createdAt: number;
}

function createGroupMember(groupId: string, userId: string, roleId: string): IGroupMember {
  return {
    id: randomUUID(),
    groupId,
    userId,
    roleId,
    createdAt: Date.now(),
  };
}

function changeMemberRole(member: IGroupMember, newRoleId: string): IGroupMember {
  return { ...member, roleId: newRoleId };
}

function canDo(permissionNames: PermissionName[], permission: PermissionName): boolean {
  return hasPermission(permissionNames, permission);
}

export { createGroupMember, changeMemberRole, canDo };
