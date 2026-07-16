import { refreshSession } from "@/src/services/session";
import { apiError, apiSuccess } from "@/src/app/api/_response";
import { SESSION_COOKIE } from "@/src/app/api/_session";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionId) {
      throw new Error("No session cookie found");
    }

    const result = await refreshSession(sessionId);
    if (!result.ok) {
      cookieStore.delete(SESSION_COOKIE);
      return apiError(result.error, 401);
    }

    const { data } = result;
    cookieStore.set(SESSION_COOKIE, data.id, {
      sameSite: "lax",
      expires: data.expiredAt,
    });

    return apiSuccess(data);
  } catch (err) {
    return apiError(err, 500);
  }
}
