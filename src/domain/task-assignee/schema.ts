const taskAssigneeFieldDefs = {
  id: { type: "string", format: "uuid" },
  taskId: { type: "string", format: "uuid" },
  userId: { type: "string", format: "uuid" },
  assignedAt: { type: "number" },
};

const taskAssigneeSchema = {
  $defs: taskAssigneeFieldDefs,
  type: "object",
  properties: {
    id: { $ref: "#/$defs/id" },
    taskId: { $ref: "#/$defs/taskId" },
    userId: { $ref: "#/$defs/userId" },
    assignedAt: { $ref: "#/$defs/assignedAt" },
  },
  required: ["id", "taskId", "userId", "assignedAt"],
  additionalProperties: false,
};

const taskAssigneeInputSchema = {
  $defs: taskAssigneeFieldDefs,
  type: "object",
  properties: {
    taskId: { $ref: "#/$defs/taskId" },
    userId: { $ref: "#/$defs/userId" },
  },
  required: ["taskId", "userId"],
  additionalProperties: false,
};

export { taskAssigneeSchema, taskAssigneeInputSchema };
