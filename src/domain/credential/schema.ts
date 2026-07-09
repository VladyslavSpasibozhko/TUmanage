const credentialFieldDefs = {
  email: { type: "string", format: "email" },
  password: { type: "string", minLength: 8 },
};

const credentialSchema = {
  $defs: credentialFieldDefs,
  type: "object",
  properties: {
    email: { $ref: "#/$defs/email" },
    password: { $ref: "#/$defs/password" },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

export { credentialSchema };
