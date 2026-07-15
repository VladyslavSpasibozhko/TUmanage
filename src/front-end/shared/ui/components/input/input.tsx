export interface IInputProps
  extends Omit<React.ComponentProps<"input">, "size"> {
  size?: "sm" | "md" | "lg";
}

const sizeClassName: Record<NonNullable<IInputProps["size"]>, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-11 px-4 text-base",
};

export default function Input({
  size = "md",
  className = "",
  ...props
}: IInputProps) {
  return (
    <input
      className={`w-full rounded-md border border-border bg-surface text-text-primary
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:border-red-500
        ${sizeClassName[size]} ${className}`}
      {...props}
    />
  );
}
