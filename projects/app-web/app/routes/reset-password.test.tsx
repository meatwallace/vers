import userEvent from '@testing-library/user-event';
import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { type Route } from './+types/reset-password';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { ResetPassword, action, loader } from './reset-password.tsx';
import {
  SESSION_KEY_VERIFY_RESET_PASSWORD_EMAIL,
  SESSION_KEY_VERIFY_RESET_PASSWORD_TOKEN,
} from '~/session/consts.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';

type TestConfig = {
  initialPath?: string;
  verifySessionEmail?: string;
  verifySessionResetToken?: string;
};

async function setupTest(config: Partial<TestConfig> = {}) {
  const user = userEvent.setup();

  const verifySession = await verifySessionStorage.getSession();

  verifySession.set(
    SESSION_KEY_VERIFY_RESET_PASSWORD_EMAIL,
    config.verifySessionEmail ?? 'test@example.com',
  );

  verifySession.set(
    SESSION_KEY_VERIFY_RESET_PASSWORD_TOKEN,
    config.verifySessionResetToken ?? 'test_reset_token',
  );

  const cookie = await verifySessionStorage.commitSession(verifySession);

  // wrap our loader that sets our cookie in the request
  const loaderWithCookie = async ({ request, ...rest }: Route.LoaderArgs) => {
    request.headers.set('cookie', cookie);

    return loader({
      request,
      ...rest,
      context: {
        ...rest.context,
        session: verifySession,
      },
    });
  };

  const actionWithCookie = async ({ request, ...rest }: Route.ActionArgs) => {
    request.headers.set('cookie', cookie);

    return action({
      request,
      ...rest,
      context: {
        ...rest.context,
        session: verifySession,
      },
    });
  };

  const ResetPasswordStub = createRoutesStub([
    {
      path: '/',
      Component: withRouteProps(ResetPassword),
      // @ts-expect-error(#35) - react router test types are out of date
      loader: loaderWithCookie,
      // @ts-expect-error(#35) - react router test types are out of date
      action: actionWithCookie,
    },
    {
      path: Routes.Login,
      Component: () => 'LOGIN_ROUTE',
    },
  ]);

  const defaultInitialPath = `/?token=test_reset_token`;

  render(
    <ResetPasswordStub
      initialEntries={[config.initialPath ?? defaultInitialPath]}
    />,
  );

  return { user };
}

afterEach(() => {
  drop(db);
});

test('it renders the reset password form with accessible elements', async () => {
  setupTest();

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
  const { user } = await setupTest();

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
  const { user } = await setupTest();

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
  const { user } = await setupTest();

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
  setupTest({ initialPath: '/' });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it redirects to login if the reset token is not present in the session', async () => {
  setupTest({
    verifySessionResetToken: '',
    verifySessionEmail: 'test@example.com',
    initialPath: '/?token=test_reset_token',
  });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it redirects to login if the email is not present in the session', async () => {
  setupTest({
    verifySessionEmail: '',
    initialPath: '/?token=test_reset_token',
  });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it redirects to login if the reset token doesnt match the session token', async () => {
  setupTest({
    verifySessionEmail: 'test@example.com',
    verifySessionResetToken: 'different_reset_token',
    initialPath: '/?token=test_reset_token',
  });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});
