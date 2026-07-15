export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; err: { code: number; err: string } };

export type Options = Omit<RequestInit, "method" | "body">;

export class ApiError extends Error {
  constructor(
    public readonly code: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export default async function request<T>(
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
