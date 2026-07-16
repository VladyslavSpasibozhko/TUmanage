import { login } from "@/src/services/login";
import { apiError, apiSuccess } from "@/src/app/api/_response";
import { SESSION_COOKIE } from "@/src/app/api/_session";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const result = await login({ email, password });
    if (!result.ok) {
      return apiError(result.error, 400);
    }
    const { data } = result;
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, data.id, {
      sameSite: "lax",
      expires: data.expiredAt,
    });

    return apiSuccess(data);
  } catch (err) {
    return apiError(err, 500);
  }
}
