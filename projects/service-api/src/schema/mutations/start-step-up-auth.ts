import type { AuthedContext } from '~/types';
import { logger } from '~/logger';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { builder } from '../builder';
import { TWO_FACTOR_NOT_ENABLED_ERROR, UNKNOWN_ERROR } from '../errors';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { StepUpAction } from '../types/step-up-action';
import { TwoFactorRequiredPayload } from '../types/two-factor-required-payload';
import { VerificationType } from '../types/verification-type';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof StartStepUpAuthInput.$inferInput;
}

/**
 * @description Initiates step-up authentication for secure operations requiring 2FA.
 * Creates a pending transaction for 2FA verification and returns the transaction ID.
 *
 * This mutation is only used to initiate step up auth on a subset of secure actions;
 * actions requiring specific logic or create non-step-up  auth transactions are handled
 * in their respective mutations e.g. `startPasswordReset`
 *
 * @example
 * ```gql
 * mutation StartStepUpAuth($input: StartStepUpAuthInput!) {
 *   startStepUpAuth(input: $input) {
 *     ... on TwoFactorRequiredPayload {
 *       transactionID
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
export async function startStepUpAuth(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof StartStepUpAuthPayload.$inferType> {
  try {
    const is2FAEnabled = await ctx.services.verification.getVerification.query({
      target: ctx.user.email,
      type: '2fa',
    });

    if (!is2FAEnabled) {
      return {
        error: TWO_FACTOR_NOT_ENABLED_ERROR,
      };
    }

    const transactionID = createPendingTransaction({
      action: resolveVerificationType(args.input.action),
      ipAddress: ctx.ipAddress,
      sessionID: ctx.session.id,
      target: ctx.user.email,
    });

    return { sessionID: null, transactionID };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error);
    }

    return { error: UNKNOWN_ERROR };
  }
}

/**
 * Resolves a StepUpAction to a VerificationType for the purposes of
 * creating a pending transaction.
 */
function resolveVerificationType(action: StepUpAction): VerificationType {
  const mapping: Record<StepUpAction, VerificationType> = {
    [StepUpAction.CHANGE_EMAIL]: VerificationType.CHANGE_EMAIL,
    [StepUpAction.CHANGE_PASSWORD]: VerificationType.CHANGE_PASSWORD,
    [StepUpAction.DISABLE_2FA]: VerificationType.TWO_FACTOR_AUTH_DISABLE,
  };

  return mapping[action];
}

const StartStepUpAuthInput = builder.inputType('StartStepUpAuthInput', {
  fields: (t) => ({
    action: t.field({ required: true, type: StepUpAction }),
  }),
});

const StartStepUpAuthPayload = builder.unionType('StartStepUpAuthPayload', {
  resolveType: createPayloadResolver(TwoFactorRequiredPayload),
  types: [TwoFactorRequiredPayload, MutationErrorPayload],
});

export const resolve = requireAuth(startStepUpAuth);

builder.mutationField('startStepUpAuth', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: StartStepUpAuthInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 10,
      },
    },
    resolve: resolve,
    type: StartStepUpAuthPayload,
  }),
);
