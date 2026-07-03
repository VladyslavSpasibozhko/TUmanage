const taskGroupFieldDefs = {
  id: { type: "string", format: "uuid" },
  taskId: { type: "string", format: "uuid" },
  groupId: { type: "string", format: "uuid" },
  addedAt: { type: "number" },
};

const taskGroupSchema = {
  $defs: taskGroupFieldDefs,
  type: "object",
  properties: {
    id: { $ref: "#/$defs/id" },
    taskId: { $ref: "#/$defs/taskId" },
    groupId: { $ref: "#/$defs/groupId" },
    addedAt: { $ref: "#/$defs/addedAt" },
  },
  required: ["id", "taskId", "groupId", "addedAt"],
  additionalProperties: false,
};

const taskGroupInputSchema = {
  $defs: taskGroupFieldDefs,
  type: "object",
  properties: {
    taskId: { $ref: "#/$defs/taskId" },
    groupId: { $ref: "#/$defs/groupId" },
  },
  required: ["taskId", "groupId"],
  additionalProperties: false,
};

export { taskGroupSchema, taskGroupInputSchema };
