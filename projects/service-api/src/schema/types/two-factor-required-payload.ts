import { builder } from '../builder';

export interface TwoFactorRequiredPayloadData {
  sessionID: null | string;
  transactionID: string;
}

export const TwoFactorRequiredPayload =
  builder.objectRef<TwoFactorRequiredPayloadData>('TwoFactorRequiredPayload');

TwoFactorRequiredPayload.implement({
  fields: (t) => ({
    sessionID: t.exposeString('sessionID', { nullable: true }),
    transactionID: t.exposeString('transactionID'),
  }),
});
