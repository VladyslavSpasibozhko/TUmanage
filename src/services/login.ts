import { validateEmail } from "@/src/domain/user";
import { getUserByEmail } from "@/src/repositories/user";
import { createSession } from "./session";

async function login(email: string) {
  try {
    if (!validateEmail(email)) {
      return { ok: false, error: new Error("Invalid email format") };
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return { ok: false, error: new Error("User not found") };
    }

    const sessionResult = await createSession(user.id);
    if (!sessionResult.ok) {
      return { ok: false, error: sessionResult.error };
    }

    return { ok: true, data: { user, session: sessionResult.data } };
  } catch (err) {
    return { ok: false, error: err };
  }
}

export { login };
