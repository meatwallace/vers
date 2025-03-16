import { graphql, HttpResponse } from 'msw';
import type {
  StartChangeUserPasswordMutation,
  StartChangeUserPasswordMutationVariables,
} from '~/gql/graphql';
import { VerificationType } from '~/gql/graphql';
import { db } from '../../db';
import { TWO_FACTOR_NOT_ENABLED_ERROR, UNKNOWN_ERROR } from '../../errors';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

export const StartChangeUserPassword = graphql.mutation<
  StartChangeUserPasswordMutation,
  StartChangeUserPasswordMutationVariables
>('StartChangeUserPassword', ({ request }) => {
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
        startChangeUserPassword: {
          error: UNKNOWN_ERROR,
        },
      },
    });
  }

  const verification = db.verification.findFirst({
    where: {
      target: { equals: user.email },
      type: { equals: VerificationType.TwoFactorAuth },
    },
  });

  if (!verification) {
    return HttpResponse.json({
      data: {
        startChangeUserPassword: {
          error: TWO_FACTOR_NOT_ENABLED_ERROR,
        },
      },
    });
  }

  return HttpResponse.json({
    data: {
      startChangeUserPassword: {
        transactionID: 'test_transaction_id',
      },
    },
  });
});
