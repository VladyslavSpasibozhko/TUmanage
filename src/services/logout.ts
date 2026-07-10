import { getSession, deleteSession } from "@/src/repositories/session";
import { outcome, error } from "@/src/shared/utils";

async function logout(id: string) {
  try {
    const session = await getSession(id);
    if (!session) {
      return outcome.success(null);
    }

    await deleteSession(id);
    return outcome.success(null);
  } catch (err) {
    return outcome.failure(error.getErrorMessage(err));
  }
}

export { logout };
