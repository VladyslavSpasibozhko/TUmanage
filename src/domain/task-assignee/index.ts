import { randomUUID } from "crypto";
import type { ITaskAssignee } from "./types";

function createTaskAssignee(taskId: string, userId: string): ITaskAssignee {
  return {
    id: randomUUID(),
    taskId,
    userId,
    assignedAt: Date.now(),
  };
}

export * from "./types";
export * from "./schema";
export { createTaskAssignee };
