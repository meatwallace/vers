import { builder } from '../builder';

export interface UnverifiedAuthPayloadData {
  target: string;
}

export const UnverifiedAuthPayload =
  builder.objectRef<UnverifiedAuthPayloadData>('UnverifiedAuthPayload');

UnverifiedAuthPayload.implement({
  fields: (t) => ({
    target: t.exposeString('target'),
  }),
});
