import { createTestJWT } from '@chrono/service-test-utils';
import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '../../env';
import { db } from '../../mocks/db';
import { createServiceContext } from '../utils';
import { deleteWorld } from './delete-world';

test('it deletes a world', async () => {
  const user = db.user.create({});

  db.world.create({
    id: 'test_id',
    name: 'Test World',
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

  const args = { ownerID: user.id, worldID: 'test_id' };

  const result = await deleteWorld(args, ctx);

  const deletedWorld = db.world.findFirst({
    where: { id: { equals: 'test_id' } },
  });

  expect(result).toBeTrue();
  expect(deletedWorld).toBeNull();

  drop(db);
});
