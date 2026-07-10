import { logout } from "@/src/services/logout";
import { error } from "@/src/shared/utils";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (sessionId) {
      const result = await logout(sessionId);
      if (!result.ok) {
        throw result.error;
      }
    }

    cookieStore.delete("session");

    return Response.json({ success: true, data: null });
  } catch (err) {
    return Response.json({
      success: false,
      err: { code: 500, err: error.getErrorMessage(err) },
    });
  }
}
