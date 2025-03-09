import { createTestJWT } from '@chrono/service-test-utils';
import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '../../env';
import { db } from '../../mocks/db';
import { createServiceContext } from '../utils';
import { deleteVerification } from './delete-verification';

test('it deletes a verification', async () => {
  const user = db.user.create({});

  db.verification.create({
    id: 'test_id',
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceWorld,
    apiURL: env.VERIFICATIONS_SERVICE_URL,
    accessToken,
  });

  const args = { id: 'test_id' };

  const result = await deleteVerification(args, ctx);

  const deletedVerification = db.verification.findFirst({
    where: { id: { equals: 'test_id' } },
  });

  expect(result).toBeTrue();
  expect(deletedVerification).toBeNull();

  drop(db);
});
