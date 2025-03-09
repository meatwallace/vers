import { graphql, HttpResponse } from 'msw';
import {
  StartPasswordResetInput,
  StartPasswordResetPayload,
  VerificationType,
} from '~/gql/graphql';
import { db } from '~/mocks/db';

interface StartPasswordResetVariables {
  input: StartPasswordResetInput;
}

interface StartPasswordResetResponse {
  startPasswordReset: StartPasswordResetPayload;
}

export const StartPasswordReset = graphql.mutation<
  StartPasswordResetResponse,
  StartPasswordResetVariables
>('StartPasswordReset', ({ variables }) => {
  const user = db.user.findFirst({
    where: {
      email: { equals: variables.input.email },
    },
  });

  // return a success response as to avoid user enumeration if the user doesn't exist
  if (!user) {
    return HttpResponse.json({
      data: {
        startPasswordReset: {
          success: true,
        },
      },
    });
  }

  // Create a verification record
  db.verification.create({
    target: variables.input.email,
    type: VerificationType.ResetPassword,
  });

  return HttpResponse.json({
    data: {
      startPasswordReset: {
        success: true,
      },
    },
  });
});
