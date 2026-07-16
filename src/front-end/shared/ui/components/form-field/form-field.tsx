export interface IFormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({
  id,
  label,
  error,
  children,
}: IFormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
      </label>

      {children}

      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
