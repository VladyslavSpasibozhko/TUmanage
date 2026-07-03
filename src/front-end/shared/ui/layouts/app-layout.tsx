export interface IAppLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function AppLayout({
  children,
  header,
  sidebar,
}: IAppLayoutProps) {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-bg">
      {header}
      <div className="flex flex-1">
        {sidebar}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
