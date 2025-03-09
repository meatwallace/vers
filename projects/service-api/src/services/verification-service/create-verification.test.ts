import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { createVerification } from './create-verification';

afterEach(() => {
  drop(db);
});

test('it creates a new verification', async () => {
  const ctx = createServiceContext({
    apiURL: env.VERIFICATIONS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceVerification,
  });

  const now = Date.now();

  const args = {
    expiresAt: new Date(now + 10 * 60 * 1000),
    period: 300,
    target: 'test@example.com',
    type: 'onboarding',
  } as const;

  const result = await createVerification(args, ctx);

  expect(result).toMatchObject({
    code: expect.any(String),
    verification: {
      target: 'test@example.com',
      type: 'onboarding',
    },
  });
});
