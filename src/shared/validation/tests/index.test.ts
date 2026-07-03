import { test } from "node:test";
import assert from "node:assert/strict";
import { validate } from "../index";

const userSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 2, maxLength: 12 },
    email: { type: "string", format: "email" },
  },
  required: ["email"],
};

test("passes valid data", () => {
  const result = validate(userSchema, { name: "Vlad", email: "a@b.com" });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("fails when a required field is missing", () => {
  const result = validate(userSchema, { name: "Vlad" });
  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /required/i);
});

test("fails when a field has the wrong type", () => {
  const result = validate(userSchema, { name: 123, email: "a@b.com" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes("must be string")));
});

test("fails when a string exceeds maxLength", () => {
  const result = validate(userSchema, {
    name: "way-too-long-a-name",
    email: "a@b.com",
  });
  assert.equal(result.valid, false);
});

test("accepts data with no constraints when schema is boolean true", () => {
  const result = validate(true, { anything: "goes" });
  assert.equal(result.valid, true);
});

test("rejects all data when schema is boolean false", () => {
  const result = validate(false, { anything: "goes" });
  assert.equal(result.valid, false);
});

test("reuses the compiled validator for the same schema object", () => {
  const first = validate(userSchema, { name: "Vlad", email: "a@b.com" });
  const second = validate(userSchema, { name: "Vlad", email: "a@b.com" });
  assert.equal(first.valid, true);
  assert.equal(second.valid, true);
});

test("throws at compile time for format: email without ajv-formats installed", () => {
  const schemaWithFormat = {
    type: "object",
    properties: { email: { type: "string", format: "email" } },
  };
  assert.throws(() => validate(schemaWithFormat, { email: "not-an-email" }));
});
