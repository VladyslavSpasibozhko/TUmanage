const sessionFieldDefs = {
  id: { type: "string", format: "uuid" },
  userId: { type: "string", format: "uuid" },
  expiredAt: { type: "number" },
};

const sessionSchema = {
  $defs: sessionFieldDefs,
  type: "object",
  properties: {
    id: { $ref: "#/$defs/id" },
    userId: { $ref: "#/$defs/userId" },
    expiredAt: { $ref: "#/$defs/expiredAt" },
  },
  required: ["id", "userId", "expiredAt"],
  additionalProperties: false,
};

const sessionInputSchema = {
  $defs: sessionFieldDefs,
  type: "object",
  properties: {
    userId: { $ref: "#/$defs/userId" },
  },
  required: ["userId"],
  additionalProperties: false,
};

export { sessionSchema, sessionInputSchema };
