# Domain Documentation

This file describes the business domain of this application — entities, relations, rules, and flows. It is framework-agnostic: nothing here is specific to Next.js.

---

## Domains

Two core domains that share a common permission system:

- **User Management** — registration, identity, group membership, roles
- **Task Management** — task lifecycle, assignment, group scoping

---

## Entities

### User
Represents a registered person in the system.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | Display name |
| `email` | `string` | Unique email address |
| `createdAt` | `number` | Unix timestamp |

**Rules:**
- Email must match a valid format before a user can be created
- Email must be unique across all users

---

### Session
Represents an active login. Always tied to a user.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `userId` | `string` | The logged-in user |
| `expiredAt` | `number` | Unix timestamp of expiry |

**Rules:**
- A session is created together with the user on registration
- A session is created for an existing user on login
- Sessions expire after 1 hour

---

### Permission
A named capability that can be granted to a role.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `PermissionName` | Unique permission key |
| `description` | `string` | Human-readable explanation |

**Predefined permissions:**

| Name | Description |
|------|-------------|
| `task:create` | Create a task |
| `task:update` | Update a task |
| `task:delete` | Delete a task |
| `task:assign` | Assign a task to a user |
| `user:manage` | Add/remove users from a group |
| `user:invite` | Invite a user to a group |
| `role:manage` | Assign roles to users |
| `group:manage` | Create/update groups |

---

### Role
A named set of permissions. Assigned to users within a group.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `RoleName` | `admin`, `manager`, or `member` |

**Predefined roles:**

| Role | Permissions |
|------|-------------|
| `admin` | All permissions |
| `manager` | `task:create`, `task:update`, `task:delete`, `task:assign`, `user:manage`, `user:invite` |
| `member` | `task:create`, `task:update` |

---

### Group
A workspace that users belong to. Tasks are scoped to groups.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | Group display name |
| `createdBy` | `string` | userId of the creator |
| `createdAt` | `number` | Unix timestamp |

**Rules:**
- The user who creates a group is automatically assigned the `admin` role in that group
- Group name cannot be empty

---

### Task
A unit of work. Belongs to a group and can be assigned to a user.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Short description |
| `description` | `string` | Full details |
| `status` | `TaskStatus` | `todo`, `in-progress`, or `done` |
| `createdAt` | `number` | Unix timestamp |

**Rules:**
- Title cannot be empty
- Task starts with status `todo`
- Assignee and group are optional — managed via separate relation entities

---

## Relations

All relations are modelled as explicit entities (not embedded foreign keys).

### RolePermission — Role → Permission
Defines which permissions a role has. Enables dynamic permission assignment.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `roleId` | `string` | The role |
| `permissionId` | `string` | The permission |

---

### GroupMember — User → Group (with Role)
Represents a user's membership in a group, including their role within that group.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `groupId` | `string` | The group |
| `userId` | `string` | The member |
| `roleId` | `string` | Role within this group |
| `createdAt` | `number` | Unix timestamp |

**Key point:** A user can have different roles in different groups.

---

### TaskAssignee — Task → User
Represents which user is assigned to a task.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `taskId` | `string` | The task |
| `userId` | `string` | The assignee |
| `assignedAt` | `number` | Unix timestamp |

**Rules:**
- One task has at most one assignee
- One user can be assigned to many tasks

---

### TaskGroup — Task → Group
Represents which group a task belongs to.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `taskId` | `string` | The task |
| `groupId` | `string` | The group |
| `addedAt` | `number` | Unix timestamp |

**Rules:**
- One task belongs to at most one group
- One group can contain many tasks

---

## Entity Relationship Overview

```
Session ──────────────→ User
                         │
                         └──→ GroupMember ──→ Group
                                  │
                                  └──→ Role ──→ RolePermission ──→ Permission

Task ──→ TaskAssignee ──→ User
Task ──→ TaskGroup    ──→ Group
```

---

## Auth Flow

### Registration
1. Client submits `name` + `email`
2. Email is validated (format + uniqueness)
3. `User` is created
4. `Session` is created linked to the new user
5. Session cookie is set — user is immediately logged in

### Login (existing user)
1. Client submits credentials
2. Existing user is found by email
3. `Session` is created linked to that user
4. Session cookie is set

### Logout
1. Session is deleted
2. Cookie is cleared

---

## Permission Check Flow

To verify if a user can perform an action within a group:

```
1. Find GroupMember { userId, groupId }     → get roleId
2. Find RolePermissions { roleId }          → get permissionIds
3. Find Permissions { permissionId[] }      → get permission names
4. Check if required permission is in list
```

---

## Layer Architecture

```
domain/         Pure business logic — entities, rules, validation
                No imports from any other internal layer

repositories/   Persistence only — read/write JSON files
                May import types from domain/

services/       Use-cases — orchestrates domain + repositories
                No HTTP knowledge

app/api/        Route handlers — HTTP only
                Calls services/, sets cookies, returns responses
```
