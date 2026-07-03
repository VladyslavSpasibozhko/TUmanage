import { randomUUID } from "crypto";
import type { ITask, TaskStatus } from "./types";

function createTask(title: string, description: string): ITask {
  return {
    id: randomUUID(),
    title,
    description,
    status: "todo",
    createdAt: Date.now(),
  };
}

function updateTaskStatus(task: ITask, status: TaskStatus): ITask {
  return { ...task, status };
}

function validateTitle(title: string): boolean {
  return title.trim().length > 0;
}

export * from "./types";
export * from "./schema";
export { createTask, updateTaskStatus, validateTitle };
