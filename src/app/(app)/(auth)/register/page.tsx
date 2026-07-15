"use client";

import { useRouter } from "next/navigation";
import { RegisterForm } from "@/src/front-end/features/auth-register";
import { Text } from "@/src/front-end/shared/ui";

export default function Register(props: PageProps<"/register">) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="flex flex-col gap-1 text-center">
        <Text as="h1" variant="heading">
          Create an account
        </Text>
        <Text as="p" variant="body">
          Register to get started.
        </Text>
      </div>

      <RegisterForm
        i18n={{
          nameLabel: "Name",
          emailLabel: "Email",
          passwordLabel: "Password",
          submitLabel: "Register",
          submittingLabel: "Registering…",
          networkErrorMessage: "Something went wrong. Please try again.",
        }}
        onSuccess={() => router.push("/")}
      />

      <Text as="p" variant="body" className="text-center">
        Already have an account?{" "}
        <a href="/login" className="font-medium underline">
          Log in
        </a>
      </Text>
    </div>
  );
}
