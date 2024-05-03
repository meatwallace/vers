import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { authenticator } from '../../authenticator.server';

// TODO: eslint rule to capture top level inline fns
export const loader = () => redirect('/login');

export const action = async ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate('auth0', request, {
    throwOnError: true,
  });
};
