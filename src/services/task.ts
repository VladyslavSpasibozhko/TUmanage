import { createTask, validateTitle } from "@/src/domain/task";
import { createTaskAssignee } from "@/src/domain/task-assignee";
import { createTaskGroup } from "@/src/domain/task-group";
import { canDo } from "@/src/domain/group-member";
import { saveTask } from "@/src/repositories/task";
import { saveTaskAssignee } from "@/src/repositories/task-assignee";
import { saveTaskGroup } from "@/src/repositories/task-group";
import { getGroupMember } from "@/src/repositories/group-member";
import { getPermissionNamesByRole } from "@/src/repositories/role-permission";
import { outcome, error } from "@/src/shared/utils";

async function createTaskForGroup(
  title: string,
  description: string,
  assigneeId: string,
  groupId: string,
  requestingUserId: string
) {
  try {
    if (!validateTitle(title)) {
      return outcome.failure("Task title cannot be empty");
    }

    const member = await getGroupMember(requestingUserId, groupId);
    if (!member) {
      return outcome.failure("User is not a member of this group");
    }

    const permissionNames = await getPermissionNamesByRole(member.roleId);
    if (!canDo(permissionNames, "task:create")) {
      return outcome.failure("Permission denied: task:create");
    }

    const task = createTask(title, description);
    const taskAssignee = createTaskAssignee(task.id, assigneeId);
    const taskGroup = createTaskGroup(task.id, groupId);

    await saveTask(task);
    await saveTaskAssignee(taskAssignee);
    await saveTaskGroup(taskGroup);

    return outcome.success({ task, taskAssignee, taskGroup });
  } catch (err) {
    return outcome.failure(error.getErrorMessage(err));
  }
}

export { createTaskForGroup };
