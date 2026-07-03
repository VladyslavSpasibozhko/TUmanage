import { login } from "@/src/services/login";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const { ok, data, error } = await login(email);
    if (!ok || !data?.session) {
      throw error;
    }
    const cookieStore = await cookies();

    cookieStore.set("session", data.session.id, {
      sameSite: "lax",
      expires: data.session.expiredAt,
    });

    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json({
      success: false,
      err: { code: 500, err: err },
    });
  }
}

export async function GET() {
  return Response.json({ message: "alive" });
}
