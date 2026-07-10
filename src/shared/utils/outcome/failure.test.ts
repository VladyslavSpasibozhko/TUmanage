import { test } from "node:test";
import assert from "node:assert/strict";
import { failure } from "./failure";

test("wraps an error message in a not-ok result", () => {
  const result = failure("boom");
  assert.deepEqual(result, { ok: false, error: "boom" });
});
