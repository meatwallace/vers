import { builder } from '../builder';

export interface TwoFactorLoginPayloadData {
  sessionID: string;
  transactionID: string;
}

export const TwoFactorLoginPayload =
  builder.objectRef<TwoFactorLoginPayloadData>('TwoFactorLoginPayload');

TwoFactorLoginPayload.implement({
  fields: (t) => ({
    sessionID: t.exposeString('sessionID'),
    transactionID: t.exposeString('transactionID'),
  }),
});
