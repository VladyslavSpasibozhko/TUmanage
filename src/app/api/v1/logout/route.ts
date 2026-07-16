import { logout } from "@/src/services/logout";
import { apiError, apiSuccess } from "@/src/app/api/_response";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (sessionId) {
      const result = await logout(sessionId);
      if (!result.ok) {
        return apiError(result.error, 400);
      }
    }

    cookieStore.delete("session");

    return apiSuccess(null);
  } catch (err) {
    return apiError(err, 500);
  }
}
