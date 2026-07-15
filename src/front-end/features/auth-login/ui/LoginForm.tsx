"use client";

import { Button, Form, FormField, Input } from "@/src/front-end/shared/ui";
import type { ISession } from "@/src/domain/session";
import type { ILoginFormI18n } from "../model/types";
import { useLogin } from "../model/useLogin";

export interface ILoginFormProps {
  i18n: ILoginFormI18n;
  onSuccess?: (session: ISession) => void;
}

export default function LoginForm({ i18n, onSuccess }: ILoginFormProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    formError,
    isSubmitting,
    handleSubmit,
  } = useLogin({ i18n, onSuccess });

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormField id="email" label={i18n.emailLabel}>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
          autoComplete="email"
        />
      </FormField>

      <FormField id="password" label={i18n.passwordLabel}>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
          autoComplete="current-password"
        />
      </FormField>

      {formError && (
        <p role="alert" className="text-sm text-red-500">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? i18n.submittingLabel : i18n.submitLabel}
      </Button>
    </Form>
  );
}
