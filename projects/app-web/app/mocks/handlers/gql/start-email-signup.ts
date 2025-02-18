import { graphql, HttpResponse } from 'msw';
import { MutationSuccess } from '~/gql/graphql';
import { db } from '../../db';
import { MutationResponse } from './types';

type StartEmailSignupResponse = MutationResponse<{
  startEmailSignup: MutationSuccess;
}>;

type StartEmailSignupVariables = {
  input: {
    email: string;
  };
};

export const StartEmailSignup = graphql.mutation<
  StartEmailSignupResponse,
  StartEmailSignupVariables
>('StartEmailSignup', async ({ variables }) => {
  const existingUser = db.user.findFirst({
    where: { email: { equals: variables.input.email } },
  });

  // return a success response as to avoid user enumeration the user doesn't exist
  if (existingUser) {
    return HttpResponse.json({
      data: {
        startEmailSignup: {
          success: true,
        },
      },
    });
  }

  db.verification.create({
    target: variables.input.email,
    type: 'ONBOARDING',
  });

  return HttpResponse.json({
    data: {
      startEmailSignup: {
        success: true,
      },
    },
  });
});
