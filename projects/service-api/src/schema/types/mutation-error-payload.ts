import { builder } from '../builder';
import { MutationError } from './mutation-error';

export type MutationErrorPayloadData = {
  error: typeof MutationError.$inferType;
};

export const MutationErrorPayload = builder.objectRef<MutationErrorPayloadData>(
  'MutationErrorPayload',
);

MutationErrorPayload.implement({
  fields: (t) => ({
    error: t.field({
      type: MutationError,
      resolve: (source) => source.error,
    }),
  }),
});
