"use client";

import { useState } from "react";
import { credentialSchema } from "@/src/domain/credential";
import { userInputSchema } from "@/src/domain/user";
import { validate } from "@/src/shared/validation";
import type { ISession } from "@/src/domain/session";
import type { IRegisterFormI18n } from "./types";
import { register } from "../api/register";

interface IUseRegisterOptions {
  i18n: IRegisterFormI18n;
  onSuccess?: (session: ISession) => void;
}

export function useRegister({ i18n, onSuccess }: IUseRegisterOptions) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const credentialValidation = validate(credentialSchema, { email, password });
    const userValidation = validate(userInputSchema, { name, email });
    const errors = [...credentialValidation.errors, ...userValidation.errors];
    if (errors.length > 0) {
      setFormError(errors.join(", "));
      return;
    }

    setFormError(undefined);
    setIsSubmitting(true);

    try {
      const response = await register({ name, email, password });
      if (!response.success) {
        setFormError(response.err.err);
        return;
      }
      onSuccess?.(response.data);
    } catch {
      setFormError(i18n.networkErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    formError,
    isSubmitting,
    handleSubmit,
  };
}
