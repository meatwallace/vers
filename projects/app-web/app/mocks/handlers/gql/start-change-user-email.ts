import { graphql, HttpResponse } from 'msw';
import type {
  StartChangeUserEmailInput,
  StartChangeUserEmailPayload,
} from '~/gql/graphql';
import { db } from '../../db';
import { UNKNOWN_ERROR } from '../../errors';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

interface StartChangeUserEmailVariables {
  input: StartChangeUserEmailInput;
}

interface StartChangeUserEmailResponse {
  startChangeUserEmail: StartChangeUserEmailPayload;
}

export const StartChangeUserEmail = graphql.mutation<
  StartChangeUserEmailResponse,
  StartChangeUserEmailVariables
>('StartChangeUserEmail', ({ request, variables }) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return HttpResponse.json({
      errors: [{ message: 'Unauthorized' }],
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = decodeMockJWT(token);

  const user = db.user.findFirst({
    where: { id: { equals: payload.sub } },
  });

  if (!user) {
    return HttpResponse.json({
      data: {
        startChangeUserEmail: {
          error: UNKNOWN_ERROR,
        },
      },
    });
  }

  const existingUser = db.user.findFirst({
    where: { email: { equals: variables.input.email } },
  });

  if (existingUser) {
    return HttpResponse.json({
      data: {
        startChangeUserEmail: {
          error: UNKNOWN_ERROR,
        },
      },
    });
  }

  // create a verification record for the new email
  db.verification.create({
    target: variables.input.email,
    type: 'change-email',
  });

  return HttpResponse.json({
    data: {
      startChangeUserEmail: {
        transactionID: 'test_transaction_id',
      },
    },
  });
});
