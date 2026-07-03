import { IGroup } from "@/src/domain/group";
import { readJson, writeJson } from "./utils";

const documentPath = "src/db/groups.json";

async function saveGroup(group: IGroup) {
  let groups = await readJson<Record<string, IGroup>>(documentPath);
  if (!groups) groups = {};
  groups[group.id] = group;
  await writeJson(documentPath, groups);
  return group;
}

async function getGroup(id: string) {
  const groups = await readJson<Record<string, IGroup>>(documentPath);
  if (!groups) return null;
  return groups[id] ?? null;
}

export { saveGroup, getGroup };
