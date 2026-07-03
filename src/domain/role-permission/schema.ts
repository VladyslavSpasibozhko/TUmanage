const rolePermissionFieldDefs = {
  id: { type: "string", format: "uuid" },
  roleId: { type: "string", format: "uuid" },
  permissionId: { type: "string", format: "uuid" },
};

const rolePermissionSchema = {
  $defs: rolePermissionFieldDefs,
  type: "object",
  properties: {
    id: { $ref: "#/$defs/id" },
    roleId: { $ref: "#/$defs/roleId" },
    permissionId: { $ref: "#/$defs/permissionId" },
  },
  required: ["id", "roleId", "permissionId"],
  additionalProperties: false,
};

const rolePermissionInputSchema = {
  $defs: rolePermissionFieldDefs,
  type: "object",
  properties: {
    roleId: { $ref: "#/$defs/roleId" },
    permissionId: { $ref: "#/$defs/permissionId" },
  },
  required: ["roleId", "permissionId"],
  additionalProperties: false,
};

export { rolePermissionSchema, rolePermissionInputSchema };
