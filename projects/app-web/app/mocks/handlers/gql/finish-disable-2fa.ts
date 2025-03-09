import { HttpResponse, graphql } from 'msw';
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
  title: 'Invalid code',
  message: '2FA verification is invalid or has expired',
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
          success: false,
          error: AMBIGUOUS_INVALID_VERIFICATION_ERROR,
        },
      },
    });
  }

  if (variables.input.transactionToken !== 'valid_transaction_token') {
    return HttpResponse.json({
      data: {
        finishDisable2FA: {
          success: false,
          error: AMBIGUOUS_INVALID_VERIFICATION_ERROR,
        },
      },
    });
  }

  const twoFactorVerification = db.verification.findFirst({
    where: {
      type: { equals: VerificationType.TwoFactorAuth },
      target: { equals: user.email },
    },
  });

  if (!twoFactorVerification) {
    return HttpResponse.json({
      data: {
        finishDisable2FA: {
          success: false,
          error: AMBIGUOUS_INVALID_VERIFICATION_ERROR,
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
