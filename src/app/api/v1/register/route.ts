import { register } from "@/src/services/register";
import { apiError, apiSuccess } from "@/src/app/api/_response";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const result = await register({ name, email, password });
    if (!result.ok) {
      return apiError(result.error, 400);
    }
    const { data } = result;
    const cookieStore = await cookies();

    cookieStore.set("session", data.session.id, {
      sameSite: "lax",
      expires: data.session.expiredAt,
    });

    return apiSuccess(data, 201);
  } catch (err) {
    return apiError(err, 500);
  }
}
