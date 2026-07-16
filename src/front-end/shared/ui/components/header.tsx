export interface IHeaderProps {
  title: React.ReactNode;
  actions?: React.ReactNode;
}

// TODO:might it be better to move to layout lib
export default function Header({ title, actions }: IHeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-surface px-6 flex items-center justify-between shrink-0">
      <span className="text-sm font-semibold text-text-primary">{title}</span>
      {actions}
    </header>
  );
}
