import { graphql, HttpResponse } from 'msw';
import { Verification } from '~/gql/graphql';
import { db } from '../../db';
import { MutationResponse } from './types';

type VerifyOTPResponse = MutationResponse<{
  verifyOTP: Verification;
}>;

type VerifyOTPVariables = {
  input: {
    code: string;
    target: string;
    type: string;
  };
};

export const VerifyOTP = graphql.mutation<
  VerifyOTPResponse,
  VerifyOTPVariables
>('VerifyOTP', async ({ variables }) => {
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
          error: {
            title: 'Invalid OTP',
            message: 'Invalid verification code',
          },
        },
      },
    });
  }

  if (!variables.input.code.startsWith('999')) {
    return HttpResponse.json({
      data: {
        verifyOTP: {
          error: {
            title: 'Invalid OTP',
            message: 'Invalid verification code',
          },
        },
      },
    });
  }

  return HttpResponse.json({
    data: {
      verifyOTP: {
        id: verification.id,
        target: verification.target,
      },
    },
  });
});
