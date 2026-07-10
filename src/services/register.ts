import {
  createUser,
  userInputSchema,
  type IUserInput,
} from "@/src/domain/user";
import {
  createCredential,
  credentialSchema,
  type ICredential,
} from "@/src/domain/credential";
import { saveUser } from "@/src/repositories/user";
import {
  saveCredential,
  getCredentialByEmail,
} from "@/src/repositories/credential";
import { validate } from "@/src/shared/validation";
import { outcome, error } from "@/src/shared/utils";
import { createSession } from "./session";

type IRegisterInput = IUserInput & Pick<ICredential, "password">;

async function register({ name, email, password }: IRegisterInput) {
  try {
    const credentialValidation = validate(credentialSchema, {
      email,
      password,
    });
    if (!credentialValidation.valid) {
      return outcome.failure(credentialValidation.errors.join(", "));
    }

    const userValidation = validate(userInputSchema, { name, email });
    if (!userValidation.valid) {
      return outcome.failure(userValidation.errors.join(", "));
    }

    const existing = await getCredentialByEmail(email);
    if (existing) {
      return outcome.failure("Email already in use");
    }

    const credential = createCredential(email, password);
    await saveCredential(credential);

    const user = createUser({ name, email });
    await saveUser(user);

    const session = await createSession(user.id);
    if (!session.ok) {
      return outcome.failure(session.error);
    }

    return outcome.success(session.data);
  } catch (err) {
    return outcome.failure(error.getErrorMessage(err));
  }
}

export { register };
