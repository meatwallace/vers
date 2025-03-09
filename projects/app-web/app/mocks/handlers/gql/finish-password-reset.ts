import { HttpResponse, graphql } from 'msw';
import {
  FinishPasswordResetInput,
  FinishPasswordResetPayload,
} from '~/gql/graphql';
import { db } from '~/mocks/db';

interface FinishPasswordResetVariables {
  input: FinishPasswordResetInput;
}

interface FinishPasswordResetResponse {
  finishPasswordReset: FinishPasswordResetPayload;
}

export const FinishPasswordReset = graphql.mutation<
  FinishPasswordResetResponse,
  FinishPasswordResetVariables
>('FinishPasswordReset', ({ variables }) => {
  const user = db.user.findFirst({
    where: {
      email: { equals: variables.input.email },
    },
  });

  // return a success response as to avoid user enumeration if the user doesn't exist
  if (!user) {
    return HttpResponse.json({
      data: {
        finishPasswordReset: {
          success: true,
        },
      },
    });
  }

  const twoFactorVerification = db.verification.findFirst({
    where: {
      type: { equals: '2fa' },
      target: { equals: variables.input.email },
    },
  });

  // use a hardcoded value for 'valid' transaction tokens for 2fa
  const isTransactionTokenValid =
    variables.input.transactionToken === 'valid_transaction_token';

  // return a success response if we have 2fa but our transaction token isn't valid
  if (twoFactorVerification && !isTransactionTokenValid) {
    return HttpResponse.json({
      data: {
        finishPasswordReset: {
          success: true,
        },
      },
    });
  }

  db.user.update({
    where: {
      id: { equals: user.id },
    },
    data: {
      password: variables.input.password,
      updatedAt: new Date().toISOString(),
    },
  });

  db.session.deleteMany({
    where: {
      userID: { equals: user.id },
    },
  });

  return HttpResponse.json({
    data: {
      finishPasswordReset: {
        success: true,
      },
    },
  });
});
