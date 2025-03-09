import { createTestJWT } from '@chrono/service-test-utils';
import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { getWorlds } from './get-worlds';

test('it returns the requested world', async () => {
  const user = db.user.create({});

  db.world.create({
    id: 'test_id_1',
    name: 'Test World #1',
    ownerID: user.id,
  });

  db.world.create({
    id: 'test_id_2',
    name: 'Test World #2',
    ownerID: user.id,
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createServiceContext({
    accessToken,
    apiURL: env.WORLDS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceWorld,
  });

  const args = { ownerID: user.id };

  const result = await getWorlds(args, ctx);

  expect(result).toIncludeAllPartialMembers([
    {
      id: 'test_id_1',
      name: 'Test World #1',
      ownerID: user.id,
    },
    {
      id: 'test_id_2',
      name: 'Test World #2',
      ownerID: user.id,
    },
  ]);

  drop(db);
});
