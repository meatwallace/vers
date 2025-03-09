import { afterEach, expect, test } from 'vitest';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { render, screen } from '@testing-library/react';
import { db } from '~/mocks/db';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types';
import { CreateWorldWizard, loader } from './route.tsx';

const userID = 'user_id';

interface TestConfig {
  isAuthed: boolean;
}

function setupTest(config: TestConfig) {
  const world = db.world.create({
    ownerID: userID,
  });

  const CreateWorldWizardStub = createRoutesStub([
    {
      path: '/:worldID',
      Component: withRouteProps(CreateWorldWizard),
      // @ts-expect-error(#35) - react router test types are out of date
      loader: config.isAuthed
        ? // @ts-expect-error(#35) - react router test types are out of date
          withAuthedUser(loader, { userID })
        : loader,
    },
    {
      path: Routes.Login,
      Component: () => 'LOGIN_ROUTE',
    },
  ]);

  render(<CreateWorldWizardStub initialEntries={[`/${world.id}`]} />);

  return { world };
}

afterEach(() => {
  drop(db);
});

test('it displays info about the given world', async () => {
  const { world } = setupTest({ isAuthed: true });

  const worldID = await screen.findByText(world.id, { exact: false });
  const ownerID = await screen.findByText(world.ownerID, { exact: false });

  expect(worldID).toBeInTheDocument();
  expect(ownerID).toBeInTheDocument();
});

test('it redirects to the login route when not authenticated', async () => {
  setupTest({ isAuthed: false });

  expect(await screen.findByText('LOGIN_ROUTE')).toBeInTheDocument();
});
