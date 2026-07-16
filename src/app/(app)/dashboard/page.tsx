import { AppLayout, Header, Sidebar, Text } from "@/src/front-end/shared/ui";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", active: true },
  { href: "/groups", label: "Groups" },
  { href: "/account", label: "Account" },
];

export default function DashboardPage(props: PageProps<"/dashboard">) {
  return (
    <AppLayout
      header={
        <Header
          title="Acme"
          actions={<span className="text-sm text-text-primary">Jane Doe</span>}
        />
      }
      sidebar={
        <Sidebar>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`rounded-md px-2.5 py-1.5 text-sm ${
                item.active
                  ? "bg-surface-sunken font-medium text-text-primary"
                  : "text-text-secondary"
              }`}
            >
              {item.label}
            </a>
          ))}
        </Sidebar>
      }
    >
      <Text as="h1" variant="heading">
        Dashboard
      </Text>
    </AppLayout>
  );
}
