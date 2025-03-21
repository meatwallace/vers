import { builder } from '../builder';

interface TokenPayloadData {
  accessToken: string;
  refreshToken: string;
}

export const TokenPayload = builder.objectRef<TokenPayloadData>('TokenPayload');

TokenPayload.implement({
  fields: (t) => ({
    accessToken: t.exposeString('accessToken'),
    refreshToken: t.exposeString('refreshToken'),
  }),
});
