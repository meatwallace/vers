import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { getWorlds } from './get-worlds';

test('it returns the requested world', async () => {
  const user = db.user.create({});

  db.world.create({
    id: 'test_id_1',
    ownerID: user.id,
    name: 'Test World #1',
  });

  db.world.create({
    id: 'test_id_2',
    ownerID: user.id,
    name: 'Test World #2',
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceWorld,
    apiURL: env.WORLDS_SERVICE_URL,
    accessToken,
  });

  const args = { ownerID: user.id };

  const result = await getWorlds(args, ctx);

  expect(result).toIncludeAllPartialMembers([
    {
      id: 'test_id_1',
      ownerID: user.id,
      name: 'Test World #1',
    },
    {
      id: 'test_id_2',
      ownerID: user.id,
      name: 'Test World #2',
    },
  ]);

  drop(db);
});
