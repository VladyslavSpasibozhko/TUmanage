import { randomUUID } from "crypto";

export type TaskStatus = "todo" | "in-progress" | "done";

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
}

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

export { createTask, updateTaskStatus, validateTitle };
