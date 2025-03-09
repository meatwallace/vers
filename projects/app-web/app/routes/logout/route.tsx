import { redirect } from 'react-router';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { Routes } from '~/types';
import { logout } from '~/utils/logout.server.ts';
import type { Route } from './+types/route.ts';

export function loader() {
  return redirect(Routes.Index);
}

export async function action({ request }: Route.ActionArgs) {
  return logout(request);
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
