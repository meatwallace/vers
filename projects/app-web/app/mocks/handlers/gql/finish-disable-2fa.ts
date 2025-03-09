import { graphql, HttpResponse } from 'msw';
import {
  FinishDisable2FaInput,
  FinishDisable2FaPayload,
  VerificationType,
} from '~/gql/graphql';
import { db } from '~/mocks/db';
import { decodeMockJWT } from '~/mocks/utils/decode-mock-jwt';

interface FinishDisable2FAVariables {
  input: FinishDisable2FaInput;
}

interface FinishDisable2FAResponse {
  finishDisable2FA: FinishDisable2FaPayload;
}

const AMBIGUOUS_INVALID_VERIFICATION_ERROR = {
  message: '2FA verification is invalid or has expired',
  title: 'Invalid code',
};

export const FinishDisable2FA = graphql.mutation<
  FinishDisable2FAResponse,
  FinishDisable2FAVariables
>('FinishDisable2FA', ({ request, variables }) => {
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
        finishDisable2FA: {
          error: AMBIGUOUS_INVALID_VERIFICATION_ERROR,
          success: false,
        },
      },
    });
  }

  if (variables.input.transactionToken !== 'valid_transaction_token') {
    return HttpResponse.json({
      data: {
        finishDisable2FA: {
          error: AMBIGUOUS_INVALID_VERIFICATION_ERROR,
          success: false,
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

  if (!twoFactorVerification) {
    return HttpResponse.json({
      data: {
        finishDisable2FA: {
          error: AMBIGUOUS_INVALID_VERIFICATION_ERROR,
          success: false,
        },
      },
    });
  }

  db.verification.delete({
    where: {
      id: { equals: twoFactorVerification.id },
    },
  });

  return HttpResponse.json({
    data: {
      finishDisable2FA: {
        success: true,
      },
    },
  });
});
