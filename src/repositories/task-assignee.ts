import { ITaskAssignee } from "@/src/domain/task-assignee";
import { readJson, writeJson } from "./utils";

const documentPath = "src/db/task-assignees.json";

async function saveTaskAssignee(taskAssignee: ITaskAssignee) {
  let all = await readJson<Record<string, ITaskAssignee>>(documentPath);
  if (!all) all = {};
  all[taskAssignee.id] = taskAssignee;
  await writeJson(documentPath, all);
  return taskAssignee;
}

async function getTaskAssignee(taskId: string) {
  const all = await readJson<Record<string, ITaskAssignee>>(documentPath);
  if (!all) return null;
  return Object.values(all).find((ta) => ta.taskId === taskId) ?? null;
}

async function deleteTaskAssignee(taskId: string) {
  const all = await readJson<Record<string, ITaskAssignee>>(documentPath);
  if (!all) return;
  const entry = Object.values(all).find((ta) => ta.taskId === taskId);
  if (!entry) return;
  delete all[entry.id];
  await writeJson(documentPath, all);
}

export { saveTaskAssignee, getTaskAssignee, deleteTaskAssignee };
