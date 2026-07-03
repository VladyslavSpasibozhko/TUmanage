const groupMemberFieldDefs = {
  id: { type: "string", format: "uuid" },
  groupId: { type: "string", format: "uuid" },
  userId: { type: "string", format: "uuid" },
  roleId: { type: "string", format: "uuid" },
  createdAt: { type: "number" },
};

const groupMemberSchema = {
  $defs: groupMemberFieldDefs,
  type: "object",
  properties: {
    id: { $ref: "#/$defs/id" },
    groupId: { $ref: "#/$defs/groupId" },
    userId: { $ref: "#/$defs/userId" },
    roleId: { $ref: "#/$defs/roleId" },
    createdAt: { $ref: "#/$defs/createdAt" },
  },
  required: ["id", "groupId", "userId", "roleId", "createdAt"],
  additionalProperties: false,
};

const groupMemberInputSchema = {
  $defs: groupMemberFieldDefs,
  type: "object",
  properties: {
    groupId: { $ref: "#/$defs/groupId" },
    userId: { $ref: "#/$defs/userId" },
    roleId: { $ref: "#/$defs/roleId" },
  },
  required: ["groupId", "userId", "roleId"],
  additionalProperties: false,
};

export { groupMemberSchema, groupMemberInputSchema };
