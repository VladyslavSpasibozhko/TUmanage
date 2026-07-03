import { createGroup, validateGroupName } from "@/src/domain/group";
import { createGroupMember } from "@/src/domain/group-member";
import { saveGroup } from "@/src/repositories/group";
import { saveGroupMember } from "@/src/repositories/group-member";
import { getRoleByName } from "@/src/repositories/role";

async function createGroupWithAdmin(name: string, creatorUserId: string) {
  try {
    if (!validateGroupName(name)) {
      return { ok: false, error: new Error("Group name cannot be empty") };
    }

    const adminRole = await getRoleByName("admin");
    if (!adminRole) {
      return { ok: false, error: new Error("Admin role not found") };
    }

    const group = createGroup(name, creatorUserId);
    await saveGroup(group);

    const member = createGroupMember(group.id, creatorUserId, adminRole.id);
    await saveGroupMember(member);

    return { ok: true, data: { group, member } };
  } catch (err) {
    return { ok: false, error: err };
  }
}

export { createGroupWithAdmin };
