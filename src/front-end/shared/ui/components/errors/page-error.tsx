interface IPageErrorProps {
  message: string;
  onRetry: () => void;
}

export default function PageError({ message, onRetry }: IPageErrorProps) {
  return (
    <div>
      <p>Error happened!</p>
      <p>{message}</p>

      <button onClick={onRetry}>Retry</button>
    </div>
  );
}
