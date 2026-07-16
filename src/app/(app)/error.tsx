"use client";
import { Errors } from "@/src/front-end/shared/ui";
import { useEffect } from "react";

interface IErrorCatcherProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function ErrorCatcher({
  error,
  unstable_retry,
}: IErrorCatcherProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <Errors.PageError
        title="Something went wrong"
        message={error.message}
        retryLabel="Retry"
        onRetry={unstable_retry}
      />
    </div>
  );
}
