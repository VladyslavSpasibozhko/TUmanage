const userFieldDefs = {
  id: { type: "string", format: "uuid" },
  name: { type: "string", minLength: 2, maxLength: 12 },
  email: { type: "string", format: "email" },
  createdAt: { type: "number" },
};

const userSchema = {
  $defs: userFieldDefs,
  type: "object",
  properties: {
    id: { $ref: "#/$defs/id" },
    name: { $ref: "#/$defs/name" },
    email: { $ref: "#/$defs/email" },
    createdAt: { $ref: "#/$defs/createdAt" },
  },
  required: ["id", "name", "email", "createdAt"],
  additionalProperties: false,
};

const userInputSchema = {
  $defs: userFieldDefs,
  type: "object",
  properties: {
    name: { $ref: "#/$defs/name" },
    email: { $ref: "#/$defs/email" },
  },
  required: ["name", "email"],
  additionalProperties: false,
};

export { userSchema, userInputSchema };
