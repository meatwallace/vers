import { HttpResponse, graphql } from 'msw';
import {
  StartEnable2FaInput,
  StartEnable2FaPayload,
  VerificationType,
} from '~/gql/graphql';
import { db } from '~/mocks/db';
import { decodeMockJWT } from '~/mocks/utils/decode-mock-jwt';

interface StartEnable2FAVariables {
  input: StartEnable2FaInput;
}

interface StartEnable2FAResponse {
  startEnable2FA: StartEnable2FaPayload;
}

export const StartEnable2FA = graphql.mutation<
  StartEnable2FAResponse,
  StartEnable2FAVariables
>('StartEnable2FA', ({ request }) => {
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
        startEnable2FA: {
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

  if (is2FAEnabled) {
    return HttpResponse.json({
      data: {
        startEnable2FA: {
          error: {
            title: 'Two-factor authentication already enabled',
            message:
              'Two-factor authentication is already enabled for your account.',
          },
        },
      },
    });
  }

  const existingVerification = db.verification.findFirst({
    where: {
      type: { equals: VerificationType.TwoFactorAuthSetup },
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
    type: VerificationType.TwoFactorAuthSetup,
    target: user.email,
  });

  return HttpResponse.json({
    data: {
      startEnable2FA: {
        transactionID: 'valid-transaction-id',
        sessionID: null,
      },
    },
  });
});
