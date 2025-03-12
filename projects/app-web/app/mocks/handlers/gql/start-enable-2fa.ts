import { graphql, HttpResponse } from 'msw';
import {
  StartEnable2FaInput,
  StartEnable2FaPayload,
  VerificationType,
} from '~/gql/graphql';
import { db } from '../../db';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

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
            message: 'User not found',
            title: 'User not found',
          },
        },
      },
    });
  }

  const is2FAEnabled = db.verification.findFirst({
    where: {
      target: { equals: user.email },
      type: { equals: VerificationType.TwoFactorAuth },
    },
  });

  if (is2FAEnabled) {
    return HttpResponse.json({
      data: {
        startEnable2FA: {
          error: {
            message:
              'Two-factor authentication is already enabled for your account.',
            title: 'Two-factor authentication already enabled',
          },
        },
      },
    });
  }

  const existingVerification = db.verification.findFirst({
    where: {
      target: { equals: user.email },
      type: { equals: VerificationType.TwoFactorAuthSetup },
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
    target: user.email,
    type: VerificationType.TwoFactorAuthSetup,
  });

  return HttpResponse.json({
    data: {
      startEnable2FA: {
        sessionID: null,
        transactionID: 'valid-transaction-id',
      },
    },
  });
});
