import userEvent from '@testing-library/user-event';
import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { drop } from '@mswjs/data';
import { createRoutesStub } from 'react-router';
import { graphql } from 'msw';
import { db } from '~/mocks/db.ts';
import { server } from '~/mocks/node.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { Routes } from '~/types.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { Signup, action, loader } from './signup.tsx';

const client = createGQLClient();

type TestConfig = {
  isAuthed: boolean;
};

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const SignupStub = createRoutesStub([
    {
      path: '/',
      Component: withRouteProps(Signup),
      // @ts-expect-error(#35) - react router test types are out of date
      action: config.isAuthed
        ? // @ts-expect-error(#35) - react router test types are out of date
          withAuthedUser(action, { client })
        : action,
      // @ts-expect-error(#35) - react router test types are out of date
      loader: config.isAuthed
        ? // @ts-expect-error(#35) - react router test types are out of date
          withAuthedUser(loader, { client })
        : loader,
    },
    {
      path: Routes.VerifyOTP,
      Component: () => 'VERIFY_OTP_ROUTE',
    },
    {
      path: Routes.Dashboard,
      Component: () => 'DASHBOARD_ROUTE',
    },
  ]);

  render(<SignupStub />);

  return { user };
}

afterEach(() => {
  server.resetHandlers();
  drop(db);

  client.setHeader('authorization', '');
});

test('it renders the signup form with accessible elements', async () => {
  setupTest({ isAuthed: false });

  const emailInput = await screen.findByRole('textbox', { name: /email/i });
  const submitButton = screen.getByRole('button', { name: /signup/i });

  expect(emailInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('it shows validation error for invalid email', async () => {
  const { user } = setupTest({ isAuthed: false });

  const emailInput = await screen.findByRole('textbox', { name: /email/i });
  const submitButton = screen.getByRole('button', { name: /signup/i });

  await user.type(emailInput, 'invalid-email');
  await user.click(submitButton);

  const errorMessage = await screen.findByText('Email is invalid');

  expect(errorMessage).toBeInTheDocument();
});

test('it shows validation error when email is missing', async () => {
  const { user } = setupTest({ isAuthed: false });

  const submitButton = await screen.findByRole('button', { name: /signup/i });

  await user.click(submitButton);

  const errorMessage = await screen.findByText('Email is required');

  expect(errorMessage).toBeInTheDocument();
});

test('it redirects to verify OTP page on successful signup', async () => {
  const { user } = setupTest({ isAuthed: false });

  const emailInput = await screen.findByRole('textbox', { name: /email/i });
  const submitButton = screen.getByRole('button', { name: /signup/i });

  await user.type(emailInput, 'test@example.com');
  await user.click(submitButton);

  const verifyOTPRoute = await screen.findByText('VERIFY_OTP_ROUTE');

  expect(verifyOTPRoute).toBeInTheDocument();
});

test('it shows an error message when signup fails', async () => {
  server.use(
    graphql.mutation('StartEmailSignup', async () => {
      throw new Error('Internal server error');
    }),
  );

  const { user } = setupTest({ isAuthed: false });

  const emailInput = await screen.findByRole('textbox', { name: /email/i });
  const submitButton = screen.getByRole('button', { name: /signup/i });

  await user.type(emailInput, 'existing@example.com');
  await user.click(submitButton);

  const errorMessage = await screen.findByText('Something went wrong');

  expect(errorMessage).toBeInTheDocument();
});

test('it redirects to the dashboard route when already authenticated', async () => {
  setupTest({ isAuthed: true });

  expect(await screen.findByText('DASHBOARD_ROUTE')).toBeInTheDocument();
});
