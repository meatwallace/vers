import { builder } from '../builder';

export interface TwoFactorRequiredPayloadData {
  transactionID: string;
  sessionID: string | null;
}

export const TwoFactorRequiredPayload =
  builder.objectRef<TwoFactorRequiredPayloadData>('TwoFactorRequiredPayload');

TwoFactorRequiredPayload.implement({
  fields: (t) => ({
    transactionID: t.exposeString('transactionID'),
    sessionID: t.exposeString('sessionID', { nullable: true }),
  }),
});
