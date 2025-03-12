import { graphql, HttpResponse } from 'msw';
import {
  StartDisable2FaInput,
  StartDisable2FaPayload,
  VerificationType,
} from '~/gql/graphql';
import { db } from '../../db';
import { TWO_FACTOR_NOT_ENABLED_ERROR, UNKNOWN_ERROR } from '../../errors';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

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
          error: UNKNOWN_ERROR,
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

  if (!is2FAEnabled) {
    return HttpResponse.json({
      data: {
        startDisable2FA: {
          error: TWO_FACTOR_NOT_ENABLED_ERROR,
        },
      },
    });
  }

  const existingVerification = db.verification.findFirst({
    where: {
      target: { equals: user.email },
      type: { equals: VerificationType.TwoFactorAuthDisable },
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
    type: VerificationType.TwoFactorAuthDisable,
  });

  return HttpResponse.json({
    data: {
      startDisable2FA: {
        sessionID: null,
        transactionID: 'valid-transaction-id',
      },
    },
  });
});
