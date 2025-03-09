import { HttpResponse, graphql } from 'msw';
import {
  FinishEnable2FaInput,
  FinishEnable2FaPayload,
  VerificationType,
} from '~/gql/graphql';
import { db } from '~/mocks/db';
import { decodeMockJWT } from '~/mocks/utils/decode-mock-jwt';

interface FinishEnable2FAVariables {
  input: FinishEnable2FaInput;
}

interface FinishEnable2FAResponse {
  finishEnable2FA: FinishEnable2FaPayload;
}

const AMBIGUOUS_INVALID_VERIFICATION_ERROR = {
  title: 'Invalid code',
  message: '2FA verification is invalid or has expired',
};

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
          success: false,
          error: AMBIGUOUS_INVALID_VERIFICATION_ERROR,
        },
      },
    });
  }

  if (variables.input.transactionToken !== 'valid_transaction_token') {
    return HttpResponse.json({
      data: {
        finishEnable2FA: {
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

  if (twoFactorVerification) {
    return HttpResponse.json({
      data: {
        finishEnable2FA: {
          success: false,
          error: AMBIGUOUS_INVALID_VERIFICATION_ERROR,
        },
      },
    });
  }

  db.verification.update({
    where: {
      type: { equals: VerificationType.TwoFactorAuthSetup },
      target: { equals: user.email },
    },
    data: {
      type: VerificationType.TwoFactorAuth,
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
