import type { IRole } from "./types";

export type RoleName = "admin" | "manager" | "member";

export const ROLES: Record<RoleName, Omit<IRole, "id">> = {
  admin: { name: "admin" },
  manager: { name: "manager" },
  member: { name: "member" },
};

export * from "./types";
export * from "./schema";
