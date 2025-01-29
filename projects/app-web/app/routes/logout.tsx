import { redirect } from 'react-router';
import { type Route } from './+types/logout';
import { logout } from '~/utils/logout.server.ts';
import { Routes } from '~/types';

export async function loader() {
  return redirect(Routes.Index);
}

export async function action({ request }: Route.ActionArgs) {
  return logout(request);
}
