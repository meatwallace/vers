import { builder } from '../builder';

interface TwoFactorSuccessPayloadData {
  transactionToken: string;
}

export const TwoFactorSuccessPayload =
  builder.objectRef<TwoFactorSuccessPayloadData>('TwoFactorSuccessPayload');

TwoFactorSuccessPayload.implement({
  fields: (t) => ({
    transactionToken: t.exposeString('transactionToken'),
  }),
});
