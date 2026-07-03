import { AppLayout, IAppLayoutProps } from "@/src/front-end/shared/ui";

export default function Layout(props: IAppLayoutProps) {
  return (
    <div>
      <AppLayout {...props} />
    </div>
  );
}
