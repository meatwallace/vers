import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { createTestJWT } from '@vers/service-test-utils';
import { ServiceID } from '@vers/service-types';
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
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createServiceContext({
    accessToken,
    apiURL: env.VERIFICATIONS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceVerification,
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
