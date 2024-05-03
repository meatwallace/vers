import { render, screen } from '@testing-library/react';
import { createRemixStub } from '@remix-run/testing';
import { Form } from '@remix-run/react';
import userEvent from '@testing-library/user-event';
import { drop } from '@mswjs/data';
import { client } from '../../client';
import { db } from '../../mocks/db';
import { Routes } from '../../types';
import { action } from './create';

const MOCK_TOKEN = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0IiwiaWF0IjoxNzE0NDA5NTMxLCJleHAiOjE3NDU5NDU1MzEsImF1ZCI6Ind3dy50ZXN0LmNvbSIsInN1YiI6ImF1dGgwfHRlc3RfaWQifQ.Drta5B74QNaMfKpZtFyCde5YG-e1eTU6tySwknytnig`;

function setupTest() {
  client.setHeader('authorization', MOCK_TOKEN);

  const user = db.user.create({});

  const CreateWorldStub = createRemixStub([
    {
      path: '/',
      Component: () => (
        <Form action={Routes.CreateWorld} method="post">
          <button type="submit">Create</button>
        </Form>
      ),
    },
    { path: Routes.CreateWorld, Component: null, action },
    { path: Routes.CreateWorldWizard, Component: () => 'Create World Wizard' },
  ]);

  render(<CreateWorldStub />);

  return { user: userEvent.setup(), userID: user.id };
}

function teardownTest() {
  drop(db);

  client.setHeader('authorization', '');
}

test('it creates a world and redirects to the world creation wizard', async () => {
  const { user, userID } = setupTest();

  const createButton = await screen.findByText('Create');

  await user.click(createButton);

  const createWorldWizard = await screen.findByText('Create World Wizard');

  expect(createWorldWizard).toBeInTheDocument();

  const world = db.world.findFirst({
    where: {
      ownerID: {
        equals: userID,
      },
    },
  });

  expect(world).not.toBeNull();

  teardownTest();
});
