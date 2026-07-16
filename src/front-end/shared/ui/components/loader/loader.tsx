export interface ILoaderProps {
  size?: "sm" | "md" | "lg";
}

const sizeClassName: Record<NonNullable<ILoaderProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-4",
};

export default function Loader({ size = "md" }: ILoaderProps) {
  return (
    <div
      role="status"
      className={`animate-spin rounded-full border-border border-t-text-primary ${sizeClassName[size]}`}
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
}
