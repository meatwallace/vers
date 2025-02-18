import { graphql, HttpResponse } from 'msw';
import { MutationSuccess } from '~/gql/graphql';
import { type MutationResponse } from './types';
import { db } from '~/mocks/db';

type StartPasswordResetResponse = MutationResponse<{
  startPasswordReset: MutationSuccess;
}>;

type StartPasswordResetVariables = {
  input: {
    email: string;
  };
};

export const StartPasswordReset = graphql.mutation<
  StartPasswordResetResponse,
  StartPasswordResetVariables
>('StartPasswordReset', async ({ variables }) => {
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
    type: 'RESET_PASSWORD',
  });

  return HttpResponse.json({
    data: {
      startPasswordReset: {
        success: true,
      },
    },
  });
});
