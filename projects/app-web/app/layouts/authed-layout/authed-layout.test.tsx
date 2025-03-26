import { afterEach, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { server } from '~/mocks/node.ts';
import { composeDataFnWrappers } from '~/test-utils/compose-data-fn-wrappers.ts';
import { withAppLoadContext } from '~/test-utils/with-app-load-context.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { AuthedLayout, loader } from './authed-layout.tsx';

interface TestConfig {
  isAuthed: boolean;
  user?: {
    id?: string;
    name?: string;
  };
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const _loader = composeDataFnWrappers(
    loader,
    withAppLoadContext,
    config.isAuthed && ((_) => withAuthedUser(_, { user: config.user })),
  );

  const AuthedLayoutStub = createRoutesStub([
    {
      Component: withRouteProps(AuthedLayout),
      loader: _loader,
      path: '/',
    },
    {
      Component: () => 'LOGIN_ROUTE',
      path: Routes.Login,
    },
  ]);

  render(<AuthedLayoutStub />);

  return { user };
}

afterEach(() => {
  server.resetHandlers();

  drop(db);
});

test('it redirects to the login route when not authenticated', async () => {
  setupTest({ isAuthed: false });

  await screen.findByText('LOGIN_ROUTE');
});
