import { refreshSession } from "@/src/services/session";
import { apiError, apiSuccess } from "@/src/app/api/_response";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (!sessionId) {
      throw new Error("No session cookie found");
    }

    const result = await refreshSession(sessionId);
    if (!result.ok) {
      cookieStore.delete("session");
      return apiError(result.error, 401);
    }

    const { data } = result;
    cookieStore.set("session", data.id, {
      sameSite: "lax",
      expires: data.expiredAt,
    });

    return apiSuccess(data);
  } catch (err) {
    return apiError(err, 500);
  }
}
