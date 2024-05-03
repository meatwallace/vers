import { render, screen } from '@testing-library/react';
import { createRemixStub } from '@remix-run/testing';
import { drop } from '@mswjs/data';
import { client } from '../../client';
import { db } from '../../mocks/db';
import { CreateWorldWizard, loader } from './create.$worldID';

const MOCK_TOKEN = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0IiwiaWF0IjoxNzE0NDA5NTMxLCJleHAiOjE3NDU5NDU1MzEsImF1ZCI6Ind3dy50ZXN0LmNvbSIsInN1YiI6ImF1dGgwfHRlc3RfaWQifQ.Drta5B74QNaMfKpZtFyCde5YG-e1eTU6tySwknytnig`;

function setupTest() {
  client.setHeader('authorization', MOCK_TOKEN);

  const user = db.user.create({
    auth0ID: 'auth0|test_id',
  });

  const world = db.world.create({
    ownerID: user.id,
  });

  const CreateWorldWizardStub = createRemixStub([
    {
      path: '/:worldID',
      loader,
      Component: CreateWorldWizard,
    },
  ]);

  render(<CreateWorldWizardStub initialEntries={[`/${world.id}`]} />);

  return { user, world };
}

function teardownTest() {
  drop(db);

  client.setHeader('authorization', '');
}

test('it displays info about the given world', async () => {
  const { world } = setupTest();

  const worldID = await screen.findByText(world.id, { exact: false });
  const ownerID = await screen.findByText(world.ownerID, { exact: false });

  expect(worldID).toBeInTheDocument();
  expect(ownerID).toBeInTheDocument();

  teardownTest();
});
