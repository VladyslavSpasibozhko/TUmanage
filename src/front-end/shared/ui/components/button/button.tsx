export interface IButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const sizeClassName: Record<NonNullable<IButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-base gap-2.5",
};

const variantClassName: Record<NonNullable<IButtonProps["variant"]>, string> = {
  primary: "bg-text-primary text-surface border-transparent",
  secondary: "bg-surface text-text-primary border-border",
};

export default function Button({
  variant = "primary",
  size = "md",
  startIcon,
  endIcon,
  className = "",
  children,
  ...props
}: IButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md border font-medium
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed aria-busy:opacity-60 aria-busy:cursor-wait
        ${sizeClassName[size]} ${variantClassName[variant]} ${className}`}
      {...props}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
}
