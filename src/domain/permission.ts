export type PermissionName =
  | "task:create"
  | "task:update"
  | "task:delete"
  | "task:assign"
  | "user:manage"
  | "user:invite"
  | "role:manage"
  | "group:manage";

export interface IPermission {
  id: string;
  name: PermissionName;
  description: string;
}

export const PERMISSIONS: Record<PermissionName, Omit<IPermission, "id">> = {
  "task:create": { name: "task:create", description: "Create a task" },
  "task:update": { name: "task:update", description: "Update a task" },
  "task:delete": { name: "task:delete", description: "Delete a task" },
  "task:assign": { name: "task:assign", description: "Assign a task to a user" },
  "user:manage": { name: "user:manage", description: "Add/remove users from a group" },
  "user:invite": { name: "user:invite", description: "Invite a user to a group" },
  "role:manage": { name: "role:manage", description: "Assign roles to users" },
  "group:manage": { name: "group:manage", description: "Create/update groups" },
};
