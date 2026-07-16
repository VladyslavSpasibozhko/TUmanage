export interface ISidebarProps {
  children?: React.ReactNode;
}

// TODO:might it be better to move to layout lib
export default function Sidebar({ children }: ISidebarProps) {
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-surface p-3">
      <nav className="flex flex-col gap-0.5">{children}</nav>
    </aside>
  );
}
