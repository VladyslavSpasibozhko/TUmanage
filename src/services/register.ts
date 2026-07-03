import { createUser, validateEmail } from "@/src/domain/user";
import { saveUser, getUserByEmail } from "@/src/repositories/user";
import { createSession } from "./session";

async function register(name: string, email: string) {
  try {
    if (!validateEmail(email)) {
      return { ok: false, error: new Error("Invalid email format") };
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return { ok: false, error: new Error("Email already in use") };
    }

    const user = createUser(name, email);
    await saveUser(user);

    const sessionResult = await createSession(user.id);
    if (!sessionResult.ok) {
      return { ok: false, error: sessionResult.error };
    }

    return { ok: true, data: { user, session: sessionResult.data } };
  } catch (err) {
    return { ok: false, error: err };
  }
}

export { register };
