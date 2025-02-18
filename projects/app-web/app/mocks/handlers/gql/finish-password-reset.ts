import { graphql, HttpResponse } from 'msw';
import { MutationSuccess } from '~/gql/graphql';
import { type MutationResponse } from './types';
import { db } from '~/mocks/db';

type FinishPasswordResetResponse = MutationResponse<{
  finishPasswordReset: MutationSuccess;
}>;

type FinishPasswordResetVariables = {
  input: {
    email: string;
    password: string;
  };
};

export const FinishPasswordReset = graphql.mutation<
  FinishPasswordResetResponse,
  FinishPasswordResetVariables
>('FinishPasswordReset', async ({ variables }) => {
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
