import { test } from "node:test";
import assert from "node:assert/strict";
import { getErrorMessage } from "./getErrorMessage";

test("returns the message of an Error instance", () => {
  assert.equal(getErrorMessage(new Error("boom")), "boom");
});

test("returns a plain string unchanged", () => {
  assert.equal(getErrorMessage("boom"), "boom");
});

test("stringifies any other value", () => {
  assert.equal(getErrorMessage(404), "404");
  assert.equal(getErrorMessage(null), "null");
});
