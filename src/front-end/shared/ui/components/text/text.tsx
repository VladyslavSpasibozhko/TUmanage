export interface ITextProps extends React.ComponentProps<"p"> {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  variant?: "heading" | "body";
}

const variantClassName: Record<NonNullable<ITextProps["variant"]>, string> = {
  heading: "text-xl font-semibold text-text-primary",
  body: "text-sm text-text-primary",
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
