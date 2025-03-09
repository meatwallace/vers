import { afterEach, expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub, redirect } from 'react-router';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { Dashboard, loader } from './route.tsx';

interface TestConfig {
  isAuthed: boolean;
  user?: {
    id?: string;
    name?: string;
  };
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const DashboardStub = createRoutesStub([
    {
      Component: withRouteProps(Dashboard),
      // @ts-expect-error(#35) - react router test types are out of date
      loader: config.isAuthed
        ? // @ts-expect-error(#35) - react router test types are out of date
          withAuthedUser(loader, { user: config.user })
        : loader,
      path: '/',
    },
    {
      action: () => null,
      Component: () => 'LOGOUT_ROUTE',
      path: Routes.Logout,
    },
    {
      Component: () => 'LOGIN_ROUTE',
      path: Routes.Login,
    },
    {
      action: () => redirect(Routes.CreateWorldWizard),
      path: Routes.CreateWorld,
    },
    {
      Component: () => 'CREATE_WORLD_WIZARD_ROUTE',
      path: Routes.CreateWorldWizard,
    },
  ]);

  render(<DashboardStub />);

  return { user };
}

afterEach(() => {
  drop(db);
});

test('it redirects to the login route when not authenticated', async () => {
  setupTest({ isAuthed: false });

  await screen.findByText('LOGIN_ROUTE');
});

test('it renders the dashboard when authenticated', async () => {
  setupTest({ isAuthed: true, user: { id: 'user_id', name: 'Test User' } });

  const greeting = await screen.findByText('Test User');

  expect(greeting).toBeInTheDocument();
});

test('it renders a log out button that navigates to the logout route when clicked', async () => {
  const { user } = setupTest({ isAuthed: true, user: { id: 'user_id' } });

  const logOutButton = await screen.findByRole('button', { name: 'Log out' });

  await waitFor(() => user.click(logOutButton));

  const loggedOutMessage = await screen.findByText('LOGOUT_ROUTE');

  expect(loggedOutMessage).toBeInTheDocument();
});

test('it displays placeholder text when the user has no worlds', async () => {
  setupTest({ isAuthed: true, user: { id: 'user_id' } });

  await screen.findByText("You haven't created a world yet.");
});

test('it creates a world when the user clicks the create world button', async () => {
  const { user } = setupTest({ isAuthed: true, user: { id: 'user_id' } });

  const createWorldButton = await screen.findByRole('button', {
    name: 'Create world',
  });

  await user.click(createWorldButton);

  const world = await screen.findByText('CREATE_WORLD_WIZARD_ROUTE');

  expect(world).toBeInTheDocument();
});

test('it renders a list of worlds', async () => {
  db.world.create({ name: 'Test World #1', ownerID: 'test_id' });
  db.world.create({ name: 'Test World #2', ownerID: 'test_id' });
  db.world.create({ name: 'Test World #3', ownerID: 'test_id' });

  setupTest({ isAuthed: true, user: { id: 'test_id' } });

  await screen.findByText('Test World #1');
  await screen.findByText('Test World #2');
  await screen.findByText('Test World #3');
});
