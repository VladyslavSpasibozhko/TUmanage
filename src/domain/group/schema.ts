const groupFieldDefs = {
  id: { type: "string", format: "uuid" },
  name: { type: "string", minLength: 1 },
  createdBy: { type: "string", format: "uuid" },
  createdAt: { type: "number" },
};

const groupSchema = {
  $defs: groupFieldDefs,
  type: "object",
  properties: {
    id: { $ref: "#/$defs/id" },
    name: { $ref: "#/$defs/name" },
    createdBy: { $ref: "#/$defs/createdBy" },
    createdAt: { $ref: "#/$defs/createdAt" },
  },
  required: ["id", "name", "createdBy", "createdAt"],
  additionalProperties: false,
};

const groupInputSchema = {
  $defs: groupFieldDefs,
  type: "object",
  properties: {
    name: { $ref: "#/$defs/name" },
    createdBy: { $ref: "#/$defs/createdBy" },
  },
  required: ["name", "createdBy"],
  additionalProperties: false,
};

export { groupSchema, groupInputSchema };
