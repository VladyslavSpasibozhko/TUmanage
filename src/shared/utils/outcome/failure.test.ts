import { test } from "node:test";
import assert from "node:assert/strict";
import { failure } from "./failure";

test("wraps an error in a not-ok result", () => {
  const err = new Error("boom");
  const result = failure(err);
  assert.deepEqual(result, { ok: false, error: err });
});
