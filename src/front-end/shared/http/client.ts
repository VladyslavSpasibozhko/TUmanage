import { ApiError } from "./errors";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; err: { code: number; err: string } };

type Options = Omit<RequestInit, "method" | "body">;

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, res.statusText);
  }

  return await res.json();
}

export const http = {
  get<T>(path: string, init?: Options) {
    return request<T>(path, { ...init, method: "GET" });
  },
  post<T>(path: string, body: unknown, init?: Options) {
    return request<T>(path, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  put<T>(path: string, body: unknown, init?: Options) {
    return request<T>(path, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
  patch<T>(path: string, body: unknown, init?: Options) {
    return request<T>(path, {
      ...init,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },
  del<T>(path: string, init?: Options) {
    return request<T>(path, { ...init, method: "DELETE" });
  },
};
