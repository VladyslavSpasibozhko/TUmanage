export type RoleName = "admin" | "manager" | "member";

export interface IRole {
  id: string;
  name: RoleName;
}

export const ROLES: Record<RoleName, Omit<IRole, "id">> = {
  admin: { name: "admin" },
  manager: { name: "manager" },
  member: { name: "member" },
};
