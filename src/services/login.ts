import { validateEmail } from "@/src/domain/user";
import { getUserByEmail } from "@/src/repositories/user";
import { outcome } from "@/src/shared/utils";
import { createSession } from "./session";

async function login(email: string) {
  try {
    if (!validateEmail(email)) {
      return outcome.failure("Invalid email format");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return outcome.failure("User not found");
    }

    const sessionResult = await createSession(user.id);
    if (!sessionResult.ok) {
      return outcome.failure(sessionResult.error);
    }

    return outcome.success({ user, session: sessionResult.data });
  } catch (err) {
    return outcome.failure(err instanceof Error ? err.message : String(err));
  }
}

export { login };
