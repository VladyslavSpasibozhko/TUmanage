import Button from "../button/button";
import Text from "../text/text";

interface IPageErrorProps {
  title: string;
  message: string;
  retryLabel: string;
  onRetry: () => void;
}

export default function PageError({
  title,
  message,
  retryLabel,
  onRetry,
}: IPageErrorProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-border bg-surface p-6 text-center">
      <Text as="h2" variant="heading">
        {title}
      </Text>
      <Text variant="body" className="text-text-secondary">
        {message}
      </Text>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}
