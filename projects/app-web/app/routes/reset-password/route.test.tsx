import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { VerificationType } from '~/gql/graphql.ts';
import { db } from '~/mocks/db.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import type { Route } from './+types/route.ts';
import { action, loader, ResetPassword } from './route.tsx';

interface TestConfig {
  initialPath: string;
  transactionToken?: string;
}

async function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const verifySession = await verifySessionStorage.getSession();

  if (config.transactionToken) {
    verifySession.set('transactionToken', config.transactionToken);
  }

  const cookie = await verifySessionStorage.commitSession(verifySession);

  // wrap our loader that sets our cookie in the request
  const loaderWithCookie = async ({ request, ...rest }: Route.LoaderArgs) => {
    request.headers.set('cookie', cookie);

    return loader({ ...rest, params: {}, request });
  };

  const actionWithCookie = async ({ request, ...rest }: Route.ActionArgs) => {
    request.headers.set('cookie', cookie);

    return action({ ...rest, request });
  };

  const ResetPasswordStub = createRoutesStub([
    {
      action: actionWithCookie,
      Component: withRouteProps(ResetPassword),
      loader: loaderWithCookie,
      path: '/',
    },
    {
      Component: () => 'LOGIN_ROUTE',
      path: Routes.Login,
    },
  ]);

  render(<ResetPasswordStub initialEntries={[config.initialPath]} />);

  return { user };
}

afterEach(() => {
  drop(db);
});

test('it renders the reset password form with accessible elements', async () => {
  await setupTest({
    initialPath: '/?email=test@example.com&token=test_reset_token',
  });

  const newPasswordInput = await screen.findByLabelText(/new password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const submitButton = screen.getByRole('button', { name: /reset password/i });
  const loginLink = screen.getByRole('link', { name: /login/i });

  expect(newPasswordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
  expect(loginLink).toBeInTheDocument();
});

test('it shows validation errors for mismatched passwords', async () => {
  const { user } = await setupTest({
    initialPath: '/?email=test@example.com&token=test_reset_token',
  });

  const newPasswordInput = await screen.findByLabelText(/new password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const submitButton = screen.getByRole('button', { name: /reset password/i });

  await user.type(newPasswordInput, 'password123');
  await user.type(confirmPasswordInput, 'password456');
  await user.click(submitButton);

  const errorText = await screen.findByText(/passwords must match/i);

  expect(errorText).toBeInTheDocument();
});

test('it shows validation errors for invalid password', async () => {
  const { user } = await setupTest({
    initialPath: '/?email=test@example.com&token=test_reset_token',
  });

  const newPasswordInput = await screen.findByLabelText(/new password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const submitButton = screen.getByRole('button', { name: /reset password/i });

  await user.type(newPasswordInput, 'weak');
  await user.type(confirmPasswordInput, 'weak');
  await user.click(submitButton);

  const errorText = await screen.findAllByText(/password is too short/i);

  expect(errorText).toHaveLength(2);
});

test('it redirects to login on successful password reset', async () => {
  const { user } = await setupTest({
    initialPath: '/?email=test@example.com&token=test_reset_token',
  });

  db.user.create({
    email: 'test@example.com',
    password: 'oldpassword123',
  });

  const newPasswordInput = await screen.findByLabelText(/new password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const submitButton = screen.getByRole('button', { name: /reset password/i });

  await user.type(newPasswordInput, 'newpassword123');
  await user.type(confirmPasswordInput, 'newpassword123');
  await user.click(submitButton);

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it redirects to login if reset token is missing from params', async () => {
  await setupTest({ initialPath: '/?email=test@example.com' });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it redirects to login if the email is missing from the params', async () => {
  await setupTest({ initialPath: '/?token=test_reset_token' });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it passes the transaction token if 2FA was required for the reset', async () => {
  const { user } = await setupTest({
    initialPath: '/?email=test@example.com&token=test_reset_token',
    transactionToken: 'valid_transaction_token',
  });

  db.user.create({
    email: 'test@example.com',
    password: 'oldpassword123',
  });

  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.TwoFactorAuth,
  });

  const newPasswordInput = await screen.findByLabelText(/new password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const submitButton = screen.getByRole('button', { name: /reset password/i });

  await user.type(newPasswordInput, 'newpassword123');
  await user.type(confirmPasswordInput, 'newpassword123');
  await user.click(submitButton);

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();

  const updatedUser = db.user.findFirst({
    where: {
      email: { equals: 'test@example.com' },
    },
  });

  expect(updatedUser?.password).toBe('newpassword123');
});
