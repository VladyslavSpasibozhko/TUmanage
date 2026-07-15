"use client";

import { useState } from "react";
import { credentialSchema } from "@/src/domain/credential";
import { validate } from "@/src/shared/validation";
import type { ISession } from "@/src/domain/session";
import type { ILoginFormI18n } from "./types";
import { login } from "../api/login";

interface IUseLoginOptions {
  i18n: ILoginFormI18n;
  onSuccess?: (session: ISession) => void;
}

export function useLogin({ i18n, onSuccess }: IUseLoginOptions) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const { valid, errors } = validate(credentialSchema, { email, password });
    if (!valid) {
      setFormError(errors.join(", "));
      return;
    }

    setFormError(undefined);
    setIsSubmitting(true);

    try {
      const response = await login({ email, password });
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
    email,
    setEmail,
    password,
    setPassword,
    formError,
    isSubmitting,
    handleSubmit,
  };
}
