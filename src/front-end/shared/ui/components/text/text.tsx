export interface ITextProps extends React.ComponentProps<"p"> {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  variant?: "heading" | "section" | "body" | "meta";
}

const variantClassName: Record<NonNullable<ITextProps["variant"]>, string> = {
  heading: "text-xl font-semibold text-text-primary",
  section: "text-xs font-semibold uppercase tracking-wide text-text-secondary",
  body: "text-sm text-text-primary",
  meta: "text-xs text-text-tertiary",
};

export default function Text({
  as: Component = "p",
  variant = "body",
  className = "",
  children,
  ...props
}: ITextProps) {
  return (
    <Component className={`${variantClassName[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
}
