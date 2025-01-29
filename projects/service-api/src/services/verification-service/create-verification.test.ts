import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { createVerification } from './create-verification';

test('it creates a new verification', async () => {
  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceVerification,
    apiURL: env.VERIFICATIONS_SERVICE_URL,
  });

  const args = {
    type: 'reset-password',
    target: 'test@example.com',
    period: 300,
  } as const;

  const result = await createVerification(args, ctx);

  expect(result).toMatchObject({
    code: expect.any(String),
    verification: {
      type: args.type,
      target: args.target,
    },
  });

  drop(db);
});
