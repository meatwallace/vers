import { HttpResponse, graphql } from 'msw';
import {
  StartDisable2FaInput,
  StartDisable2FaPayload,
  VerificationType,
} from '~/gql/graphql';
import { db } from '~/mocks/db';
import { decodeMockJWT } from '~/mocks/utils/decode-mock-jwt';

interface StartDisable2FAVariables {
  input: StartDisable2FaInput;
}

interface StartDisable2FAResponse {
  startDisable2FA: StartDisable2FaPayload;
}

export const StartDisable2FA = graphql.mutation<
  StartDisable2FAResponse,
  StartDisable2FAVariables
>('StartDisable2FA', ({ request }) => {
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
        startDisable2FA: {
          error: {
            title: 'User not found',
            message: 'User not found',
          },
        },
      },
    });
  }

  const is2FAEnabled = db.verification.findFirst({
    where: {
      type: { equals: VerificationType.TwoFactorAuth },
      target: { equals: user.email },
    },
  });

  if (!is2FAEnabled) {
    return HttpResponse.json({
      data: {
        startDisable2FA: {
          error: {
            title: '2FA not enabled',
            message: '2FA is not enabled for your account.',
          },
        },
      },
    });
  }

  const existingVerification = db.verification.findFirst({
    where: {
      type: { equals: VerificationType.TwoFactorAuthDisable },
      target: { equals: user.email },
    },
  });

  if (existingVerification) {
    db.verification.delete({
      where: {
        id: { equals: existingVerification.id },
      },
    });
  }

  db.verification.create({
    type: VerificationType.TwoFactorAuthDisable,
    target: user.email,
  });

  return HttpResponse.json({
    data: {
      startDisable2FA: {
        transactionID: 'valid-transaction-id',
        sessionID: null,
      },
    },
  });
});
