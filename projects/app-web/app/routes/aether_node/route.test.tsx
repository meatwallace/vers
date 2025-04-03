import { afterEach, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { Class } from '@vers/data';
import { db } from '~/mocks/db.ts';
import { composeDataFnWrappers } from '~/test-utils/compose-data-fn-wrappers.ts';
import { withAppLoadContext } from '~/test-utils/with-app-load-context.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { AetherNodeRoute, loader } from './route.tsx';

interface TestConfig {
  isAuthed: boolean;
  user?: {
    id?: string;
  };
}

// for now, stub out our idle simulation
vi.mock('@vers/idle-client', async (importOriginal) => {
  const original = await importOriginal<typeof import('@vers/idle-client')>();

  return {
    ...original,
    AetherNode: () => 'AETHER_NODE_COMPONENT',
  };
});

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const _loader = composeDataFnWrappers(
    loader,
    withAppLoadContext,
    config.isAuthed && ((_) => withAuthedUser(_, { user: config.user })),
  );

  const AetherNodeStub = createRoutesStub([
    {
      Component: withRouteProps(AetherNodeRoute),
      loader: _loader,
      path: '/',
    },
    {
      Component: () => 'LOGIN_ROUTE',
      path: Routes.Login,
    },
    {
      Component: () => 'AVATAR_CREATE_ROUTE',
      path: Routes.AvatarCreate,
    },
  ]);

  render(<AetherNodeStub />);

  return { user };
}

afterEach(() => {
  drop(db);
});

test('it redirects to the login route when not authenticated', async () => {
  setupTest({ isAuthed: false });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it redirects to the avatar create route when no avatar exists', async () => {
  setupTest({ isAuthed: true });

  const avatarCreateRoute = await screen.findByText('AVATAR_CREATE_ROUTE');

  expect(avatarCreateRoute).toBeInTheDocument();
});

test('it renders the aether node when authenticated and avatar exists', async () => {
  db.avatar.create({
    class: Class.Scoundrel,
    level: 20,
    name: 'Test Avatar',
    userID: 'user_id',
  });

  setupTest({ isAuthed: true, user: { id: 'user_id' } });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const aetherNode = await screen.findByText('AETHER_NODE_COMPONENT');

  expect(aetherNode).toBeInTheDocument();
});
