import { AuthedContext } from '~/types';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { MutationSuccess } from '../types/mutation-success';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof DeleteSessionInput.$inferInput;
}

const DeleteSessionInput = builder.inputType('DeleteSessionInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});

const DeleteSessionPayload = builder.unionType('DeleteSessionPayload', {
  resolveType: createPayloadResolver(MutationSuccess),
  types: [MutationSuccess, MutationErrorPayload],
});

export async function deleteSession(
  root: unknown,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof DeleteSessionPayload.$inferType> {
  // eslint-disable-next-line no-useless-catch
  try {
    await ctx.services.session.deleteSession({
      id: args.input.id,
      userID: ctx.user.id,
    });

    return { success: true };
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

export const resolve = requireAuth(deleteSession);

builder.mutationField('deleteSession', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: DeleteSessionInput }),
    },
    resolve,
    type: DeleteSessionPayload,
  }),
);
