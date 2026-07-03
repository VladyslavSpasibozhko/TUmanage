const permissionFieldDefs = {
  id: { type: "string", format: "uuid" },
  name: { type: "string", minLength: 1 },
  description: { type: "string" },
};

const permissionSchema = {
  $defs: permissionFieldDefs,
  type: "object",
  properties: {
    id: { $ref: "#/$defs/id" },
    name: { $ref: "#/$defs/name" },
    description: { $ref: "#/$defs/description" },
  },
  required: ["id", "name", "description"],
  additionalProperties: false,
};

export { permissionSchema };
