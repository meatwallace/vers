import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { env } from '../../env';
import { db } from '../../mocks/db';
import { createServiceContext } from '../utils';
import { deleteWorld } from './delete-world';

test('it deletes a world', async () => {
  const user = db.user.create({});

  db.world.create({
    id: 'test_id',
    ownerID: user.id,
    name: 'Test World',
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

  const args = { ownerID: user.id, worldID: 'test_id' };

  const result = await deleteWorld(args, ctx);

  const deletedWorld = db.world.findFirst({
    where: { id: { equals: 'test_id' } },
  });

  expect(result).toBeTrue();
  expect(deletedWorld).toBeNull();

  drop(db);
});
