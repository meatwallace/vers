import { HttpResponse, graphql } from 'msw';
import {
  GetEnable2FaVerificationQueryVariables,
  TwoFactorVerification,
  VerificationType,
} from '~/gql/graphql';
import { db } from '../../db';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

type GetEnable2FAVerificationVariables = GetEnable2FaVerificationQueryVariables;

interface GetEnable2FAVerificationResponse {
  getEnable2FAVerification: TwoFactorVerification;
}

export const GetEnable2FAVerification = graphql.query<
  GetEnable2FAVerificationResponse,
  GetEnable2FAVerificationVariables
>('GetEnable2FAVerification', ({ request }) => {
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
      errors: [{ message: 'Internal Server Error' }],
    });
  }

  const verification = db.verification.findFirst({
    where: {
      type: { equals: VerificationType.TwoFactorAuthSetup },
      target: { equals: user.email },
    },
  });

  if (!verification) {
    return HttpResponse.json({
      errors: [{ message: 'Internal Server Error' }],
    });
  }

  const otpURI = `otpauth://totp/Chrononomicon:${user.email}?secret=JBSWY3DPEHPK3PXP&issuer=Chrononomicon`;

  return HttpResponse.json({
    data: {
      getEnable2FAVerification: {
        otpURI,
      },
    },
  });
});
