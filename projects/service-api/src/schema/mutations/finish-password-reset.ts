import { type Context } from '~/types';
import { generatePasswordChangedEmail } from '@chrono/email-templates';
import { builder } from '../builder';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { MutationSuccess } from '../types/mutation-success';

/**
 * @description Completes a password reset by updating the user's password and sending a confirmation email
 *
 * @example
 * ```gql
 * mutation FinishPasswordReset {
 *   finishPasswordReset(input: {
 *     email: "test@example.com",
 *     password: "newPassword123"
 *   }) {
 *     ... on FinishPasswordResetPayload {
 *       success
 *     }
 *
 *     ... on MutationErrorPayload {
 *       error {
 *         title
 *         message
 *       }
 *     }
 *   }
 * }
 * ```
 */

type Args = {
  input: typeof FinishPasswordResetInput.$inferInput;
};

export async function finishPasswordReset(
  _: object,
  args: Args,
  ctx: Context,
): Promise<typeof FinishPasswordResetPayload.$inferType> {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await ctx.services.user.getUser({
      email: args.input.email,
    });

    // return a success response as to avoid user enumeration if the user doesn't exist
    if (!user) {
      return { success: true };
    }

    await ctx.services.user.changePassword({
      resetToken: args.input.resetToken,
      id: user.id,
      password: args.input.password,
    });

    const email = await generatePasswordChangedEmail({
      email: user.email,
    });

    try {
      await ctx.services.email.sendEmail({
        to: user.email,
        subject: 'Password Changed',
        html: email.html,
        plainText: email.plainText,
      });
    } catch (error) {
      // TODO(#16): capture email sending failure via Sentry
      console.error('Failed to send password changed email:', error);
    }

    // still return success since the password was updated
    return { success: true };
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw error;
  }
}

const FinishPasswordResetInput = builder.inputType('FinishPasswordResetInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
    resetToken: t.string({ required: true }),
  }),
});

const FinishPasswordResetPayload = builder.unionType(
  'FinishPasswordResetPayload',
  {
    types: [MutationSuccess, MutationErrorPayload],
    resolveType: createPayloadResolver(MutationSuccess),
  },
);

export const resolve = finishPasswordReset;

builder.mutationField('finishPasswordReset', (t) =>
  t.field({
    type: FinishPasswordResetPayload,
    args: {
      input: t.arg({ type: FinishPasswordResetInput, required: true }),
    },
    resolve: finishPasswordReset,
  }),
);
