"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/src/front-end/features/auth-login";
import { Text } from "@/src/front-end/shared/ui";

export default function Login(props: PageProps<"/login">) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="flex flex-col gap-1 text-center">
        <Text as="h1" variant="heading">
          Welcome back
        </Text>
        <Text as="p" variant="body">
          Log in to continue to your account.
        </Text>
      </div>

      <LoginForm
        i18n={{
          emailLabel: "Email",
          passwordLabel: "Password",
          submitLabel: "Log in",
          submittingLabel: "Logging in…",
          networkErrorMessage: "Something went wrong. Please try again.",
        }}
        onSuccess={() => router.push("/")}
      />

      <Text as="p" variant="body" className="text-center">
        Don&apos;t have an account?{" "}
        <a href="/register" className="font-medium underline">
          Register
        </a>
      </Text>
    </div>
  );
}
