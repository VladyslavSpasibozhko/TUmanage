const taskFieldDefs = {
  id: { type: "string", format: "uuid" },
  title: { type: "string", minLength: 1 },
  description: { type: "string" },
  status: { type: "string", enum: ["todo", "in-progress", "done"] },
  createdAt: { type: "number" },
};

const taskSchema = {
  $defs: taskFieldDefs,
  type: "object",
  properties: {
    id: { $ref: "#/$defs/id" },
    title: { $ref: "#/$defs/title" },
    description: { $ref: "#/$defs/description" },
    status: { $ref: "#/$defs/status" },
    createdAt: { $ref: "#/$defs/createdAt" },
  },
  required: ["id", "title", "description", "status", "createdAt"],
  additionalProperties: false,
};

const taskInputSchema = {
  $defs: taskFieldDefs,
  type: "object",
  properties: {
    title: { $ref: "#/$defs/title" },
    description: { $ref: "#/$defs/description" },
  },
  required: ["title", "description"],
  additionalProperties: false,
};

export { taskSchema, taskInputSchema };
