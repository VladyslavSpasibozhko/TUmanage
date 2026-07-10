import { createGroup, validateGroupName } from "@/src/domain/group";
import { createGroupMember } from "@/src/domain/group-member";
import { saveGroup } from "@/src/repositories/group";
import { saveGroupMember } from "@/src/repositories/group-member";
import { getRoleByName } from "@/src/repositories/role";
import { outcome } from "@/src/shared/utils";

async function createGroupWithAdmin(name: string, creatorUserId: string) {
  try {
    if (!validateGroupName(name)) {
      return outcome.failure("Group name cannot be empty");
    }

    const adminRole = await getRoleByName("admin");
    if (!adminRole) {
      return outcome.failure("Admin role not found");
    }

    const group = createGroup(name, creatorUserId);
    await saveGroup(group);

    const member = createGroupMember(group.id, creatorUserId, adminRole.id);
    await saveGroupMember(member);

    return outcome.success({ group, member });
  } catch (err) {
    return outcome.failure(err instanceof Error ? err.message : String(err));
  }
}

export { createGroupWithAdmin };
