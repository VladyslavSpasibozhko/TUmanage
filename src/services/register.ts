import { createUser, validateEmail } from "@/src/domain/user";
import { saveUser, getUserByEmail } from "@/src/repositories/user";
import { outcome } from "@/src/shared/utils";
import { createSession } from "./session";

async function register(name: string, email: string) {
  try {
    if (!validateEmail(email)) {
      return outcome.failure("Invalid email format");
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return outcome.failure("Email already in use");
    }

    const user = createUser(name, email);
    await saveUser(user);

    const sessionResult = await createSession(user.id);
    if (!sessionResult.ok) {
      return outcome.failure(sessionResult.error);
    }

    return outcome.success({ user, session: sessionResult.data });
  } catch (err) {
    return outcome.failure(err instanceof Error ? err.message : String(err));
  }
}

export { register };
