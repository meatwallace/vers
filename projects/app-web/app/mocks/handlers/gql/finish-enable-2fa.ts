import { graphql, HttpResponse } from 'msw';
import {
  FinishEnable2FaInput,
  FinishEnable2FaPayload,
  VerificationType,
} from '~/gql/graphql';
import { db } from '../../db';
import { UNKNOWN_ERROR } from '../../errors';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

interface FinishEnable2FAVariables {
  input: FinishEnable2FaInput;
}

interface FinishEnable2FAResponse {
  finishEnable2FA: FinishEnable2FaPayload;
}

export const FinishEnable2FA = graphql.mutation<
  FinishEnable2FAResponse,
  FinishEnable2FAVariables
>('FinishEnable2FA', ({ request, variables }) => {
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
        finishEnable2FA: {
          error: UNKNOWN_ERROR,
        },
      },
    });
  }

  if (variables.input.transactionToken !== 'valid_transaction_token') {
    return HttpResponse.json({
      data: {
        finishEnable2FA: {
          error: UNKNOWN_ERROR,
        },
      },
    });
  }

  const twoFactorVerification = db.verification.findFirst({
    where: {
      target: { equals: user.email },
      type: { equals: VerificationType.TwoFactorAuth },
    },
  });

  if (twoFactorVerification) {
    return HttpResponse.json({
      data: {
        finishEnable2FA: {
          error: UNKNOWN_ERROR,
        },
      },
    });
  }

  db.verification.update({
    data: {
      type: VerificationType.TwoFactorAuth,
    },
    where: {
      target: { equals: user.email },
      type: { equals: VerificationType.TwoFactorAuthSetup },
    },
  });

  return HttpResponse.json({
    data: {
      finishEnable2FA: {
        success: true,
      },
    },
  });
});
