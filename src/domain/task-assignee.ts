import { randomUUID } from "crypto";

export interface ITaskAssignee {
  id: string;
  taskId: string;
  userId: string;
  assignedAt: number;
}

function createTaskAssignee(taskId: string, userId: string): ITaskAssignee {
  return {
    id: randomUUID(),
    taskId,
    userId,
    assignedAt: Date.now(),
  };
}

export { createTaskAssignee };
