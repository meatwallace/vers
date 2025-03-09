import { HttpResponse, graphql } from 'msw';
import {
  StartEmailSignupInput,
  StartEmailSignupPayload,
  VerificationType,
} from '~/gql/graphql';
import { db } from '../../db';

interface StartEmailSignupVariables {
  input: StartEmailSignupInput;
}

interface StartEmailSignupResponse {
  startEmailSignup: StartEmailSignupPayload;
}

export const StartEmailSignup = graphql.mutation<
  StartEmailSignupResponse,
  StartEmailSignupVariables
>('StartEmailSignup', ({ variables }) => {
  const existingUser = db.user.findFirst({
    where: { email: { equals: variables.input.email } },
  });

  // return a success response as to avoid user enumeration the user doesn't exist
  if (existingUser) {
    return HttpResponse.json({
      data: {
        startEmailSignup: {
          transactionID: 'valid-transaction-id',
        },
      },
    });
  }

  db.verification.create({
    target: variables.input.email,
    type: VerificationType.Onboarding,
  });

  return HttpResponse.json({
    data: {
      startEmailSignup: {
        transactionID: 'valid-transaction-id',
      },
    },
  });
});
