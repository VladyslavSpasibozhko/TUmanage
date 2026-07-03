import { randomUUID } from "crypto";

export interface IGroup {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
}

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

export { createGroup, updateGroup, validateGroupName };
