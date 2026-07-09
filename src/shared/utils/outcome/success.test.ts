import { test } from "node:test";
import assert from "node:assert/strict";
import { success } from "./success";

test("wraps data in an ok result", () => {
  const result = success({ id: "1" });
  assert.deepEqual(result, { ok: true, data: { id: "1" } });
});
