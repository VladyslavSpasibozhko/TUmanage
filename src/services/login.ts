import { credentialSchema, type ICredential } from "@/src/domain/credential";
import { getCredentialByEmail } from "@/src/repositories/credential";
import { getUserByEmail } from "@/src/repositories/user";
import { validate } from "@/src/shared/validation";
import { outcome, error } from "@/src/shared/utils";
import { createSession } from "./session";

type ILoginInput = ICredential;

async function login({ email, password }: ILoginInput) {
  try {
    const { valid, errors } = validate(credentialSchema, { email, password });
    if (!valid) {
      return outcome.failure(errors.join(", "));
    }

    const credential = await getCredentialByEmail(email);
    if (!credential || credential.password !== password) {
      return outcome.failure("Invalid email or password");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return outcome.failure("User not found");
    }

    const session = await createSession(user.id);
    if (!session.ok) {
      return outcome.failure(session.error);
    }

    return outcome.success(session.data);
  } catch (err) {
    return outcome.failure(error.getErrorMessage(err));
  }
}

export { login };
