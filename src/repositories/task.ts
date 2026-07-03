import { ITask } from "@/src/domain/task";
import { readJson, writeJson } from "./utils";

const documentPath = "src/db/tasks.json";

async function saveTask(task: ITask) {
  let tasks = await readJson<Record<string, ITask>>(documentPath);
  if (!tasks) tasks = {};
  tasks[task.id] = task;
  await writeJson(documentPath, tasks);
  return task;
}

async function getTask(id: string) {
  const tasks = await readJson<Record<string, ITask>>(documentPath);
  if (!tasks) return null;
  return tasks[id] ?? null;
}

async function getTasksByGroup(groupId: string) {
  const tasks = await readJson<Record<string, ITask>>(documentPath);
  if (!tasks) return [];
  return Object.values(tasks).filter((t) => t.groupId === groupId);
}

export { saveTask, getTask, getTasksByGroup };
