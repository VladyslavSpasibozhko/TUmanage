import { randomUUID } from "crypto";

export interface ITaskGroup {
  id: string;
  taskId: string;
  groupId: string;
  addedAt: number;
}

function createTaskGroup(taskId: string, groupId: string): ITaskGroup {
  return {
    id: randomUUID(),
    taskId,
    groupId,
    addedAt: Date.now(),
  };
}

export { createTaskGroup };
