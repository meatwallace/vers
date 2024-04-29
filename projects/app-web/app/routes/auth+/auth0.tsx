import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { authenticator } from '../../authenticator.server';

export const loader = () => redirect('/login');

export const action = async ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate('auth0', request, {
    throwOnError: true,
  });
};
