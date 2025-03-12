import { graphql, HttpResponse } from 'msw';
import {
  VerificationType,
  VerifyOtpInput,
  VerifyOtpPayload,
} from '~/gql/graphql';
import { db } from '../../db';
import { INVALID_OTP_ERROR } from '../../errors';

interface VerifyOTPResponse {
  verifyOTP: VerifyOtpPayload;
}

interface VerifyOTPVariables {
  input: VerifyOtpInput;
}

export const VerifyOTP = graphql.mutation<
  VerifyOTPResponse,
  VerifyOTPVariables
>('VerifyOTP', ({ variables }) => {
  const verification = db.verification.findFirst({
    where: {
      target: { equals: variables.input.target },
      type: { equals: variables.input.type },
    },
  });

  if (!verification) {
    return HttpResponse.json({
      data: {
        verifyOTP: {
          error: INVALID_OTP_ERROR,
        },
      },
    });
  }

  if (!variables.input.code.startsWith('999')) {
    return HttpResponse.json({
      data: {
        verifyOTP: {
          error: INVALID_OTP_ERROR,
        },
      },
    });
  }

  const is2FA =
    verification.type === VerificationType.TwoFactorAuth ||
    verification.type === VerificationType.TwoFactorAuthSetup;

  if (!is2FA) {
    db.verification.delete({
      where: {
        id: { equals: verification.id },
      },
    });
  }

  return HttpResponse.json({
    data: {
      verifyOTP: {
        transactionToken: 'valid_transaction_token',
      },
    },
  });
});
