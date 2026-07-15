export type IFormProps = React.ComponentProps<"form">;

export default function Form({
  className = "",
  children,
  ...props
}: IFormProps) {
  return (
    <form className={`flex flex-col gap-4 ${className}`} {...props}>
      {children}
    </form>
  );
}
