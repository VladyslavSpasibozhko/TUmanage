# entities/

Front-end representations of the domain entities defined in `src/domain/`. Each entity folder contains TypeScript types, constants, and pure helper functions scoped to that entity.

## Rules

- No API calls, no side effects, no async code
- No imports from `features/`
- May import from `shared/` for shared types or utilities
- One folder per entity — named after the domain entity (lowercase, singular)

## Entity Folders

```
entities/
  user/        → User identity (id, name, email)
  session/     → Active login session (id, userId, expiredAt)
  task/        → Unit of work (id, title, description, status)
  group/       → Workspace / team (id, name, createdBy)
  role/        → Permission set assigned to a user in a group (admin, manager, member)
```

## Entity Descriptions

### `user/`

Represents a registered person in the system.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | Display name |
| `email` | `string` | Unique email address |
| `createdAt` | `number` | Unix timestamp of account creation |

**Typical contents:**
- `types.ts` — `User` interface
- `utils.ts` — pure helpers (e.g. `formatUserName`, `isValidEmail`)

---

### `session/`

Represents an active login. Tied to a single user. Expires after 1 hour.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `userId` | `string` | The logged-in user's ID |
| `expiredAt` | `number` | Unix timestamp of expiry |

**Typical contents:**
- `types.ts` — `Session` interface
- `utils.ts` — `isSessionExpired(session: Session): boolean`

---

### `task/`

A unit of work scoped to a group.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Short description |
| `description` | `string` | Full details |
| `status` | `TaskStatus` | `"todo"` \| `"in-progress"` \| `"done"` |
| `createdAt` | `number` | Unix timestamp |

**Typical contents:**
- `types.ts` — `Task` interface, `TaskStatus` union
- `constants.ts` — `TASK_STATUSES`, display labels per status
- `utils.ts` — `isTaskDone(task: Task): boolean`, etc.

---

### `group/`

A workspace that users belong to. Tasks are scoped to groups.

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | Group display name |
| `createdBy` | `string` | `userId` of the creator |
| `createdAt` | `number` | Unix timestamp |

**Typical contents:**
- `types.ts` — `Group` interface
- `utils.ts` — `isGroupAdmin(userId: string, members: GroupMember[]): boolean`

---

### `role/`

A named set of permissions assigned to a user within a group.

**Predefined roles:**

| Role | Permissions |
|------|-------------|
| `admin` | All permissions |
| `manager` | `task:create`, `task:update`, `task:delete`, `task:assign`, `user:manage`, `user:invite` |
| `member` | `task:create`, `task:update` |

**Typical contents:**
- `types.ts` — `Role` interface, `RoleName` union (`"admin" | "manager" | "member"`)
- `constants.ts` — `ROLES`, permission lists per role
- `utils.ts` — `hasPermission(role: RoleName, permission: PermissionName): boolean`

## Conventions

- Each entity folder exposes a single `index.ts` barrel: `export * from "./types"`, `export * from "./constants"`, etc.
- Helper functions are named in `camelCase` and are pure (no side effects)
- Types mirror the server-side `src/domain/` types exactly — do not add fields that don't exist on the server
