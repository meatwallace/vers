import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { GraphQLError } from 'graphql';
import { graphql } from 'msw';
import { db } from '~/mocks/db';
import { server } from '~/mocks/node';
import { withAppLoadContext } from '~/test-utils/with-app-load-context';
import { withRouteProps } from '~/test-utils/with-route-props';
import { Routes } from '~/types';
import { action, ForgotPassword, loader } from './route';

function setupTest() {
  const user = userEvent.setup();

  const _action = withAppLoadContext(action);
  const _loader = withAppLoadContext(loader);

  const ForgotPasswordStub = createRoutesStub([
    {
      action: _action,
      Component: withRouteProps(ForgotPassword),
      loader: _loader,
      path: '/',
    },
    {
      Component: withRouteProps((props) => {
        return (
          <div>
            <h1>RESET_PASSWORD_STARTED_ROUTE</h1>
            <span>{JSON.stringify(props)}</span>
          </div>
        );
      }),
      loader: ({ request }) => {
        const url = new URL(request.url);
        const email = url.searchParams.get('email');

        return { email };
      },
      path: Routes.ResetPasswordStarted,
    },
  ]);

  render(<ForgotPasswordStub />);

  return { user };
}

afterEach(() => {
  server.resetHandlers();

  drop(db);
});

test('it renders the forgot password form with accessible elements', async () => {
  setupTest();

  const emailInput = await screen.findByRole('textbox', { name: 'Email' });
  const submitButton = screen.getByRole('button', {
    name: 'Reset Password',
  });
  const loginLink = screen.getByRole('link', { name: 'Login' });

  expect(emailInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
  expect(loginLink).toBeInTheDocument();
});

test('it shows validation errors for invalid email', async () => {
  const { user } = setupTest();

  const emailInput = await screen.findByRole('textbox', { name: 'Email' });
  const submitButton = screen.getByRole('button', {
    name: 'Reset Password',
  });

  await user.type(emailInput, 'invalid-email');
  await user.click(submitButton);

  const errorText = await screen.findByText('Email is invalid');

  expect(errorText).toBeInTheDocument();
});

test('it redirects to the reset password started route after submitting a valid email', async () => {
  const { user } = setupTest();

  const emailInput = await screen.findByRole('textbox', { name: 'Email' });
  const submitButton = screen.getByRole('button', {
    name: 'Reset Password',
  });

  await user.type(emailInput, 'test@example.com');
  await user.click(submitButton);

  const resetPasswordStartedRoute = await screen.findByText(
    'RESET_PASSWORD_STARTED_ROUTE',
  );

  expect(resetPasswordStartedRoute).toBeInTheDocument();
});

test('it shows a generic error if the mutation fails', async () => {
  server.use(
    graphql.mutation('StartPasswordReset', () => {
      throw new GraphQLError('Something went wrong');
    }),
  );

  const { user } = setupTest();

  const emailInput = await screen.findByRole('textbox', { name: 'Email' });

  const submitButton = screen.getByRole('button', {
    name: 'Reset Password',
  });

  await user.type(emailInput, 'test@example.com');
  await user.click(submitButton);

  const errorText = await screen.findByText('Something went wrong');

  expect(errorText).toBeInTheDocument();
});
