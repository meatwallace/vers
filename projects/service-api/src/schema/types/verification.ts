import { VerificationData } from '~/services/verification-service/types';
import { builder } from '../builder';

export const Verification = builder.objectRef<VerificationData>('Verification');

Verification.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    target: t.exposeString('target'),
  }),
});
