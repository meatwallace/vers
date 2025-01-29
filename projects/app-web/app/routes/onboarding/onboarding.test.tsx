import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { ActionFunction, createRoutesStub, LoaderFunction } from 'react-router';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withOnboardingSession } from '~/test-utils/with-onboarding-session.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { Onboarding, action, loader } from './onboarding.tsx';
import { db } from '~/mocks/db.ts';
import { drop } from '@mswjs/data';

type TestConfig = {
  isOnboarding: boolean;
  isAuthed: boolean;
};

const onboardingEmail = 'user@test.com';

async function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  // @ts-expect-error(#35) - react router test types are out of date
  let _loader: LoaderFunction = loader;
  // @ts-expect-error(#35) - react router test types are out of date
  let _action: ActionFunction = action;

  if (config.isAuthed) {
    _loader = withAuthedUser(_loader);
    _action = withAuthedUser(_action);
  }

  if (config.isOnboarding) {
    _loader = withOnboardingSession(_loader, onboardingEmail);
    _action = withOnboardingSession(_action, onboardingEmail);
  }

  const OnboardingStub = createRoutesStub([
    {
      path: '/',
      Component: withRouteProps(Onboarding),
      loader: _loader,
      action: _action,
    },
    {
      path: Routes.Dashboard,
      Component: () => 'DASHBOARD_ROUTE',
    },
    {
      path: Routes.Signup,
      Component: () => 'SIGNUP_ROUTE',
    },
  ]);

  render(<OnboardingStub />);

  return { user };
}

afterEach(() => {
  drop(db);
});

test('it redirects to the signup route when no email is stored in the verification session', async () => {
  setupTest({ isAuthed: false, isOnboarding: false });

  expect(await screen.findByText('SIGNUP_ROUTE')).toBeInTheDocument();
});

test('it redirects to the dashboard route when authenticated', async () => {
  setupTest({ isAuthed: true, isOnboarding: true });

  expect(await screen.findByText('DASHBOARD_ROUTE')).toBeInTheDocument();
});

test('it renders the onboarding form', async () => {
  setupTest({ isAuthed: false, isOnboarding: true });

  const usernameInput = await screen.findByLabelText('Username');
  const nameInput = screen.getByLabelText('Name');
  const passwordInput = screen.getByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password');
  const agreeToTermsCheckbox = screen.getByRole('checkbox', {
    name: 'Agree to terms',
  });

  const rememberMeCheckbox = screen.getByRole('checkbox', {
    name: 'Remember me',
  });

  const submitButton = screen.getByRole('button', {
    name: 'Create an account',
  });

  expect(usernameInput).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(agreeToTermsCheckbox).toBeInTheDocument();
  expect(rememberMeCheckbox).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('it shows validation errors for missing required fields', async () => {
  const { user } = await setupTest({ isAuthed: false, isOnboarding: true });

  const createAccountButton = await screen.findByText('Create an account');

  await user.click(createAccountButton);

  const usernameError = await screen.findByText('Username is required');
  const nameError = screen.getByText('Name is required');
  const passwordErrors = screen.getAllByText('Password is required');
  const agreeToTermsError = screen.getByText(
    'You must agree to the terms of service and privacy policy',
  );

  expect(usernameError).toBeInTheDocument();
  expect(nameError).toBeInTheDocument();
  expect(passwordErrors).toHaveLength(2);
  expect(agreeToTermsError).toBeInTheDocument();
});

test('it shows validation error for mismatched passwords', async () => {
  const { user } = await setupTest({ isAuthed: false, isOnboarding: true });

  const passwordInput = await screen.findByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password');
  const createAccountButton = screen.getByText('Create an account');

  await user.type(passwordInput, 'password123');
  await user.type(confirmPasswordInput, 'password456');
  await user.click(createAccountButton);

  const passwordError = await screen.findByText(/passwords must match/i);

  expect(passwordError).toBeInTheDocument();
});

test('it redirects to dashboard on successful account creation', async () => {
  const { user } = await setupTest({ isAuthed: false, isOnboarding: true });

  const usernameInput = await screen.findByLabelText('Username');
  const nameInput = screen.getByLabelText('Name');
  const passwordInput = screen.getByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password');
  const createAccountButton = screen.getByText('Create an account');
  const agreeToTermsCheckbox = screen.getByRole('checkbox', {
    name: 'Agree to terms',
  });

  await user.type(usernameInput, 'testuser');
  await user.type(nameInput, 'Test User');
  await user.type(passwordInput, 'password123');
  await user.type(confirmPasswordInput, 'password123');
  await user.click(agreeToTermsCheckbox);
  await user.click(createAccountButton);

  const dashboardRoute = await screen.findByText('DASHBOARD_ROUTE');

  expect(dashboardRoute).toBeInTheDocument();
});
