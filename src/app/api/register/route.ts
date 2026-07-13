import { register } from "@/src/services/register";
import { error } from "@/src/shared/utils";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const result = await register({ name, email, password });
    if (!result.ok) {
      throw result.error;
    }
    const { data } = result;
    const cookieStore = await cookies();

    cookieStore.set("session", data.id, {
      sameSite: "lax",
      expires: data.expiredAt,
    });

    return Response.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return Response.json({
      success: false,
      err: { code: 500, err: error.getErrorMessage(err) },
    });
  }
}
