import { ITaskGroup } from "@/src/domain/task-group";
import { readJson, writeJson } from "./utils";

const documentPath = "src/db/task-groups.json";

async function saveTaskGroup(taskGroup: ITaskGroup) {
  let all = await readJson<Record<string, ITaskGroup>>(documentPath);
  if (!all) all = {};
  all[taskGroup.id] = taskGroup;
  await writeJson(documentPath, all);
  return taskGroup;
}

async function getTaskGroup(taskId: string) {
  const all = await readJson<Record<string, ITaskGroup>>(documentPath);
  if (!all) return null;
  return Object.values(all).find((tg) => tg.taskId === taskId) ?? null;
}

async function deleteTaskGroup(taskId: string) {
  const all = await readJson<Record<string, ITaskGroup>>(documentPath);
  if (!all) return;
  const entry = Object.values(all).find((tg) => tg.taskId === taskId);
  if (!entry) return;
  delete all[entry.id];
  await writeJson(documentPath, all);
}

export { saveTaskGroup, getTaskGroup, deleteTaskGroup };
