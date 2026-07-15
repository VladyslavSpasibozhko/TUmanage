import { test } from "node:test";
import assert from "node:assert/strict";
import { Chain, Interceptor } from "./interceptor";

test("process resolves with the original props and a null result for an empty chain", async () => {
  const chain = new Chain();
  const props = { id: "1" };

  const outcome = await chain.process(props);

  assert.deepEqual(outcome, { props, result: null });
});

test("runs interceptors in the order they were added, passing each handle's full return value as the next previous", async () => {
  const calls: unknown[] = [];
  const props = { id: "1" };
  const chain = new Chain();

  chain.add(
    new Interceptor(async (props, previous) => {
      calls.push({ step: "first", previous });
      return { props, result: "first-result" };
    }),
  );
  chain.add(
    new Interceptor(async (props, previous) => {
      calls.push({ step: "second", previous });
      return { props, result: "second-result" };
    }),
  );

  const outcome = await chain.process(props);

  assert.deepEqual(calls, [
    { step: "first", previous: null },
    { step: "second", previous: { props, result: "first-result" } },
  ]);
  assert.deepEqual(outcome, {
    props,
    result: { props, result: "second-result" },
  });
});

test("passes the same props reference to every interceptor in the chain", async () => {
  const seen: unknown[] = [];
  const chain = new Chain();

  chain.add(
    new Interceptor(async (props) => {
      seen.push(props);
      return { props, result: null };
    }),
  );
  chain.add(
    new Interceptor(async (props) => {
      seen.push(props);
      return { props, result: null };
    }),
  );

  const props = { id: "1" };
  await chain.process(props);

  assert.equal(seen[0], props);
  assert.equal(seen[1], props);
});
