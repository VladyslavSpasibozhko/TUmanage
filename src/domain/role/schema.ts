const roleFieldDefs = {
  id: { type: "string", format: "uuid" },
  name: { type: "string", minLength: 1 },
};

const roleSchema = {
  $defs: roleFieldDefs,
  type: "object",
  properties: {
    id: { $ref: "#/$defs/id" },
    name: { $ref: "#/$defs/name" },
  },
  required: ["id", "name"],
  additionalProperties: false,
};

export { roleSchema };
