import type { AppPath } from './routes.generated';

export interface RouteConfig {
  path: AppPath;
  label: string;
  permission: string | null;
}
