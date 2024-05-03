import { createJWKSMock } from 'mock-jwks';
import { drop } from '@mswjs/data';
import { createTestAccessToken } from '@chrononomicon/service-test-utils';
import { env } from '../../env';
import { server } from '../../mocks/node';
import { db } from '../../mocks/db';
import { createServiceContext } from '../utils';
import { getWorlds } from './get-worlds';

const ISSUER = `https://${env.AUTH0_DOMAIN}/`;

const jwks = createJWKSMock(ISSUER);

test('it returns the requested world', async () => {
  db.user.create({
    id: 'test_id',
  });

  db.world.create({
    id: 'test_id_1',
    ownerID: 'test_id',
    name: 'Test World #1',
  });

  db.world.create({
    id: 'test_id_2',
    ownerID: 'test_id',
    name: 'Test World #2',
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

  const result = await getWorlds(args, ctx);

  expect(result).toIncludeAllPartialMembers([
    {
      id: 'test_id_1',
      ownerID: 'test_id',
      name: 'Test World #1',
    },
    {
      id: 'test_id_2',
      ownerID: 'test_id',
      name: 'Test World #2',
    },
  ]);

  drop(db);
});
