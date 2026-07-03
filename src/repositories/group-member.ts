import { IGroupMember } from "@/src/domain/group-member";
import { readJson, writeJson } from "./utils";

const documentPath = "src/db/group-members.json";

async function saveGroupMember(member: IGroupMember) {
  let members = await readJson<Record<string, IGroupMember>>(documentPath);
  if (!members) members = {};
  members[member.id] = member;
  await writeJson(documentPath, members);
  return member;
}

async function getGroupMember(userId: string, groupId: string) {
  const members = await readJson<Record<string, IGroupMember>>(documentPath);
  if (!members) return null;
  return Object.values(members).find(
    (m) => m.userId === userId && m.groupId === groupId
  ) ?? null;
}

export { saveGroupMember, getGroupMember };
