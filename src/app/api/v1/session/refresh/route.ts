import { refreshSession } from "@/src/services/session";
import { error } from "@/src/shared/utils";
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
      return Response.json(
        { success: false, err: { code: 401, err: result.error } },
        { status: 401 }
      );
    }

    const { data } = result;
    cookieStore.set("session", data.id, {
      sameSite: "lax",
      expires: data.expiredAt,
    });

    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json({
      success: false,
      err: { code: 500, err: error.getErrorMessage(err) },
    });
  }
}
