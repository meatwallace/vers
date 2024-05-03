import { createJWKSMock } from 'mock-jwks';
import { drop } from '@mswjs/data';
import { createTestAccessToken } from '@chrononomicon/service-test-utils';
import { env } from '../../env';
import { server } from '../../mocks/node';
import { db } from '../../mocks/db';
import { createServiceContext } from '../utils';
import { deleteWorld } from './delete-world';

const ISSUER = `https://${env.AUTH0_DOMAIN}/`;

const jwks = createJWKSMock(ISSUER);

test('it deletes a world', async () => {
  db.user.create({
    id: 'test_id',
  });

  db.world.create({
    id: 'test_id',
    ownerID: 'test_id',
    name: 'Test World',
  });

  server.use(jwks.mswHandler);

  const { accessToken } = createTestAccessToken({
    jwks,
    audience: env.API_IDENTIFIER,
    issuer: ISSUER,
  });

  const ctx = createServiceContext({
    apiURL: env.WORLDS_SERVICE_URL,
    accessToken,
  });

  const args = { ownerID: 'test_id', worldID: 'test_id' };

  const result = await deleteWorld(args, ctx);

  const deletedWorld = db.world.findFirst({
    where: { id: { equals: 'test_id' } },
  });

  expect(result).toBeTrue();
  expect(deletedWorld).toBeNull();

  drop(db);
});
