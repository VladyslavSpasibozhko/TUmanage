import { randomUUID } from "crypto";
import type { ITaskGroup } from "./types";

function createTaskGroup(taskId: string, groupId: string): ITaskGroup {
  return {
    id: randomUUID(),
    taskId,
    groupId,
    addedAt: Date.now(),
  };
}

export * from "./types";
export * from "./schema";
export { createTaskGroup };
