import { afterEach, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub, useSearchParams } from 'react-router';
import { drop } from '@mswjs/data';
import { GraphQLError } from 'graphql';
import { graphql } from 'msw';
import { db } from '~/mocks/db.ts';
import { server } from '~/mocks/node.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { composeDataFnWrappers } from '~/test-utils/compose-data-fn-wrappers.ts';
import { withAppLoadContext } from '~/test-utils/with-app-load-context.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { withSession } from '~/test-utils/with-session.ts';
import { Routes } from '~/types.ts';
import { action, loader, ProfileChangeUserPassword } from './route.tsx';

interface TestConfig {
  isAuthed?: boolean;
  transactionID?: string;
  transactionToken?: string;
  user?: {
    email?: string;
    id?: string;
    is2FAEnabled?: boolean;
    password?: string;
  };
}

let setCookieHeader: null | string = null;

const _Response = globalThis.Response;

// stub the global Response object so we can capture the cookie header
vi.stubGlobal(
  'Response',
  vi.fn((body?: BodyInit | null, init?: ResponseInit) => {
    if (init?.headers instanceof Headers) {
      setCookieHeader = init.headers.get('set-cookie');
    }

    return new _Response(body, init);
  }),
);

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const sessionData = {
    'changePassword#transactionID': config.transactionID,
    'changePassword#transactionToken': config.transactionToken,
  };

  const _loader = composeDataFnWrappers(
    loader,
    withAppLoadContext,
    (_) => withSession(_, sessionData),
    config.isAuthed && ((_) => withAuthedUser(_, { user: config.user })),
  );

  const _action = composeDataFnWrappers(
    action,
    withAppLoadContext,
    (_) => withSession(_, sessionData),
    config.isAuthed && ((_) => withAuthedUser(_, { user: config.user })),
  );

  const ProfileChangeUserPasswordStub = createRoutesStub([
    {
      action: _action,
      Component: withRouteProps(ProfileChangeUserPassword),
      loader: _loader,
      path: '/',
    },
    {
      Component: () => 'PROFILE_ROUTE',
      path: Routes.Profile,
    },
    {
      Component: () => 'LOGIN_ROUTE',
      path: Routes.Login,
    },
    {
      Component: () => {
        const [searchParams] = useSearchParams();

        return (
          <>
            <h1>VERIFY_OTP_ROUTE</h1>
            <span>{searchParams.toString()}</span>
          </>
        );
      },
      path: Routes.VerifyOTP,
    },
  ]);

  render(<ProfileChangeUserPasswordStub />);

  return { user };
}

afterEach(() => {
  server.resetHandlers();

  drop(db);

  setCookieHeader = null;
});

test('it redirects to login if the user is not authenticated', async () => {
  setupTest({ isAuthed: false });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it renders the change password form when authenticated without 2FA', async () => {
  setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: false,
    },
  });

  await screen.findByRole('heading', { name: 'Change your password' });

  const currentPasswordInput = screen.getByLabelText('Current Password');
  const newPasswordInput = screen.getByLabelText('New Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
  const submitButton = screen.getByRole('button', { name: 'Change Password' });

  expect(currentPasswordInput).toBeInTheDocument();
  expect(newPasswordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('it redirects to verify 2FA as needed when no transaction token is in the session', async () => {
  setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: true,
    },
  });

  const verifyOTPRoute = await screen.findByText('VERIFY_OTP_ROUTE');
  const searchParams = screen.getByText(
    'target=test%40example.com&type=CHANGE_PASSWORD',
  );

  expect(searchParams).toBeInTheDocument();
  expect(verifyOTPRoute).toBeInTheDocument();

  const verifySession = await verifySessionStorage.getSession(setCookieHeader);

  const transactionID = verifySession.get('changePassword#transactionID');

  expect(transactionID).toStrictEqual(expect.any(String));
});

test('it renders the form when 2FA is enabled and a transaction token is in the session', async () => {
  setupTest({
    isAuthed: true,
    transactionToken: 'valid_token',
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: true,
    },
  });

  await screen.findByRole('heading', { name: 'Change your password' });

  const currentPasswordInput = screen.getByLabelText('Current Password');
  const newPasswordInput = screen.getByLabelText('New Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
  const submitButton = screen.getByRole('button', { name: 'Change Password' });

  expect(currentPasswordInput).toBeInTheDocument();
  expect(newPasswordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('it shows validation errors for invalid form submission', async () => {
  const { user } = setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: false,
    },
  });

  await screen.findByRole('heading', { name: 'Change your password' });

  const currentPasswordInput = screen.getByLabelText('Current Password');
  const newPasswordInput = screen.getByLabelText('New Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
  const submitButton = screen.getByRole('button', { name: 'Change Password' });

  await user.type(currentPasswordInput, 'current');
  await user.type(newPasswordInput, 'new');
  await user.type(confirmPasswordInput, 'different');
  await user.click(submitButton);

  const errorMessage = await screen.findByText('The passwords must match');

  expect(errorMessage).toBeInTheDocument();
});

test('it handles a successful password change without 2FA', async () => {
  const { user } = setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: false,
      password: 'current_password',
    },
  });

  await screen.findByRole('heading', { name: 'Change your password' });

  const currentPasswordInput = screen.getByLabelText('Current Password');
  const newPasswordInput = screen.getByLabelText('New Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
  const submitButton = screen.getByRole('button', { name: 'Change Password' });

  await user.type(currentPasswordInput, 'current_password');
  await user.type(newPasswordInput, 'new_password');
  await user.type(confirmPasswordInput, 'new_password');
  await user.click(submitButton);

  const profileRoute = await screen.findByText('PROFILE_ROUTE');

  expect(profileRoute).toBeInTheDocument();
});

test('it handles a successful password change with 2FA enabled and a transaction token in the session', async () => {
  const { user } = setupTest({
    isAuthed: true,
    transactionToken: 'valid_token',
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: true,
      password: 'current_password',
    },
  });

  await screen.findByRole('heading', { name: 'Change your password' });

  const currentPasswordInput = screen.getByLabelText('Current Password');
  const newPasswordInput = screen.getByLabelText('New Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
  const submitButton = screen.getByRole('button', { name: 'Change Password' });

  await user.type(currentPasswordInput, 'current_password');
  await user.type(newPasswordInput, 'new_password');
  await user.type(confirmPasswordInput, 'new_password');
  await user.click(submitButton);

  const profileRoute = await screen.findByText('PROFILE_ROUTE');

  expect(profileRoute).toBeInTheDocument();

  const verifySession = await verifySessionStorage.getSession(setCookieHeader);

  expect(verifySession.get('changePassword#transactionToken')).toBeUndefined();
  expect(verifySession.get('changePassword#transactionID')).toBeUndefined();
});

test('it shows an error when the password change fails', async () => {
  server.use(
    graphql.mutation('ChangeUserPassword', () => {
      throw new GraphQLError('Invalid current password');
    }),
  );

  const { user } = setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: false,
    },
  });

  await screen.findByRole('heading', { name: 'Change your password' });

  const currentPasswordInput = screen.getByLabelText('Current Password');
  const newPasswordInput = screen.getByLabelText('New Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
  const submitButton = screen.getByRole('button', { name: 'Change Password' });

  await user.type(currentPasswordInput, 'wrong_password');
  await user.type(newPasswordInput, 'new_password');
  await user.type(confirmPasswordInput, 'new_password');
  await user.click(submitButton);

  const errorMessage = await screen.findByText('Something went wrong');

  expect(errorMessage).toBeInTheDocument();
});
