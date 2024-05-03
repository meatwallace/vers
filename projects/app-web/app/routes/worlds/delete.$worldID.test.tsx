import { render, screen } from '@testing-library/react';
import { createRemixStub } from '@remix-run/testing';
import { Form } from '@remix-run/react';
import userEvent from '@testing-library/user-event';
import { drop } from '@mswjs/data';
import { client } from '../../client';
import { db } from '../../mocks/db';
import { Routes } from '../../types';
import { action } from './delete.$worldID';

const MOCK_TOKEN = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0IiwiaWF0IjoxNzE0NDA5NTMxLCJleHAiOjE3NDU5NDU1MzEsImF1ZCI6Ind3dy50ZXN0LmNvbSIsInN1YiI6ImF1dGgwfHRlc3RfaWQifQ.Drta5B74QNaMfKpZtFyCde5YG-e1eTU6tySwknytnig`;

function setupTest() {
  client.setHeader('authorization', MOCK_TOKEN);

  const user = db.user.create({
    auth0ID: 'auth0|test_id',
  });

  const world = db.world.create({
    ownerID: user.id,
  });

  const DeleteWorldStub = createRemixStub([
    {
      path: '/',
      Component: () => (
        <Form
          action={Routes.DeleteWorld.replace(':worldID', world.id)}
          method="post"
        >
          <button type="submit">Delete</button>
        </Form>
      ),
    },
    { path: Routes.DeleteWorld, Component: () => 'Deleted', action },
  ]);

  render(<DeleteWorldStub />);

  return { user: userEvent.setup(), worldID: world.id };
}

function teardownTest() {
  drop(db);

  client.setHeader('authorization', '');
}

test('it deletes the expected world', async () => {
  const { user, worldID } = setupTest();

  const deleteButton = await screen.findByText('Delete');

  await user.click(deleteButton);
  await screen.findByText('Deleted');

  const world = db.world.findFirst({
    where: {
      id: {
        equals: worldID,
      },
    },
  });

  expect(world).toBeNull();

  teardownTest();
});
