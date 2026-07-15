"use client";

import { Button, Form, FormField, Input } from "@/src/front-end/shared/ui";
import type { ISession } from "@/src/domain/session";
import type { IRegisterFormI18n } from "../model/types";
import { useRegister } from "../model/useRegister";

export interface IRegisterFormProps {
  i18n: IRegisterFormI18n;
  onSuccess?: (session: ISession) => void;
}

export default function RegisterForm({ i18n, onSuccess }: IRegisterFormProps) {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    formError,
    isSubmitting,
    handleSubmit,
  } = useRegister({ i18n, onSuccess });

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormField id="name" label={i18n.nameLabel}>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={isSubmitting}
          autoComplete="name"
        />
      </FormField>

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
          autoComplete="new-password"
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
