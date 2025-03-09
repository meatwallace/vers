import invariant from 'tiny-invariant';
import { Context } from '~/types';
import { builder } from '../builder';
import { Session } from '../types/session';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: {
    placeholder?: string | null | undefined;
  };
}

export async function getSessions(
  _: object,
  args: Args,
  ctx: Context,
): Promise<Array<typeof Session.$inferType>> {
  invariant(ctx.user, 'user is required in an authed resolver');

  // eslint-disable-next-line no-useless-catch
  try {
    const sessions = await ctx.services.session.getSessions({
      userID: ctx.user.id,
    });

    return sessions;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

const GetSessionsInput = builder.inputType('GetSessionsInput', {
  fields: (t) => ({
    placeholder: t.string({ required: false }),
  }),
});

export const resolve = requireAuth(getSessions);

builder.queryField('getSessions', (t) =>
  t.field({
    type: [Session],
    args: {
      input: t.arg({ type: GetSessionsInput, required: true }),
    },
    resolve,
  }),
);
