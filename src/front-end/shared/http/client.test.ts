import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createClient,
  type IHttpConfig,
  type IHttpInterceptors,
} from "./client";

function noopInterceptors(): IHttpInterceptors {
  return {
    request: { process: async () => {} },
    response: { process: async () => {} },
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

test("builds the request URL from config.baseUrl and the request path", async (t) => {
  const calls: string[] = [];
  t.mock.method(globalThis, "fetch", async (input: string | URL) => {
    calls.push(String(input));
    return jsonResponse({ success: true, data: null });
  });

  const config: IHttpConfig = { baseUrl: "https://api.example.com/" };
  const client = createClient({ interceptors: noopInterceptors(), config });

  await client.request({ path: "/users", method: "GET" });

  assert.equal(calls[0], "https://api.example.com/users");
});

test("falls back to a bare path when no baseUrl is configured", async (t) => {
  const calls: string[] = [];
  t.mock.method(globalThis, "fetch", async (input: string | URL) => {
    calls.push(String(input));
    return jsonResponse({ success: true, data: null });
  });

  const client = createClient({ interceptors: noopInterceptors(), config: {} });

  await client.request({ path: "/users", method: "GET" });

  assert.equal(calls[0], "/users");
});

test("runs the request interceptor before fetching and the response interceptor after", async (t) => {
  const order: string[] = [];
  t.mock.method(globalThis, "fetch", async () => {
    order.push("fetch");
    return jsonResponse({ success: true, data: null });
  });

  const interceptors: IHttpInterceptors = {
    request: {
      process: async () => {
        order.push("request-interceptor");
      },
    },
    response: {
      process: async () => {
        order.push("response-interceptor");
      },
    },
  };

  const client = createClient({ interceptors, config: {} });
  await client.request({ path: "/ping", method: "GET" });

  assert.deepEqual(order, [
    "request-interceptor",
    "fetch",
    "response-interceptor",
  ]);
});

test("merges config headers with per-request headers, request headers taking precedence", async (t) => {
  const calls: RequestInit[] = [];
  t.mock.method(
    globalThis,
    "fetch",
    async (_input: string | URL, init?: RequestInit) => {
      calls.push(init!);
      return jsonResponse({ success: true, data: null });
    },
  );

  const config: IHttpConfig = {
    headers: { Authorization: "Bearer base", "X-App": "app" },
  };
  const client = createClient({ interceptors: noopInterceptors(), config });

  await client.request({
    path: "/me",
    method: "GET",
    headers: { Authorization: "Bearer override" },
  });

  assert.deepEqual(calls[0].headers, {
    "Content-Type": "application/json",
    Authorization: "Bearer override",
    "X-App": "app",
  });
});

test("returns the parsed response and passes it to the response interceptor", async (t) => {
  const body = { success: true as const, data: { id: "1" } };
  t.mock.method(globalThis, "fetch", async () => jsonResponse(body));

  let seenByInterceptor: unknown;
  const interceptors: IHttpInterceptors = {
    request: { process: async () => {} },
    response: {
      process: async (response) => {
        seenByInterceptor = response;
      },
    },
  };

  const client = createClient({ interceptors, config: {} });
  const result = await client.request<{ id: string }>({
    path: "/users/1",
    method: "GET",
  });

  assert.deepEqual(result, body);
  assert.deepEqual(seenByInterceptor, body);
});
