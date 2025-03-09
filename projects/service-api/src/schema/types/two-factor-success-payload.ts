import { builder } from '../builder';

export interface TwoFactorSuccessPayloadData {
  transactionToken: string;
}

export const TwoFactorSuccessPayload =
  builder.objectRef<TwoFactorSuccessPayloadData>('TwoFactorSuccessPayload');

TwoFactorSuccessPayload.implement({
  fields: (t) => ({
    transactionToken: t.exposeString('transactionToken'),
  }),
});
