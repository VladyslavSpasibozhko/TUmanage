import { randomUUID } from "crypto";
import type { IGroup } from "./types";

function createGroup(name: string, createdBy: string): IGroup {
  return {
    id: randomUUID(),
    name,
    createdBy,
    createdAt: Date.now(),
  };
}

function updateGroup(group: IGroup, updates: Partial<Pick<IGroup, "name">>): IGroup {
  return { ...group, ...updates };
}

function validateGroupName(name: string): boolean {
  return name.trim().length > 0;
}

export * from "./types";
export * from "./schema";
export { createGroup, updateGroup, validateGroupName };
