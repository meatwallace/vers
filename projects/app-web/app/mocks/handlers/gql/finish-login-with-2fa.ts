import { HttpResponse, graphql } from 'msw';
import {
  FinishLoginWith2FaInput,
  FinishLoginWith2FaPayload,
} from '~/gql/graphql';
import { db } from '../../db';
import { encodeMockJWT } from '../../utils/encode-mock-jwt';
import { addUserResolvedFields } from './utils/add-user-resolved-fields';

interface FinishLoginWith2FAVariables {
  input: FinishLoginWith2FaInput;
}

interface FinishLoginWith2FAResponse {
  finishLoginWith2FA: FinishLoginWith2FaPayload;
}

const EXPIRATION_IN_MS = 1000 * 60 * 60 * 24; // 24 hours

const AMBIGUOUS_INVALID_VERIFICATION_ERROR = {
  title: 'Invalid code',
  message: '2FA verification is invalid or has expired',
};

export const FinishLoginWith2FA = graphql.mutation<
  FinishLoginWith2FAResponse,
  FinishLoginWith2FAVariables
>('FinishLoginWith2FA', ({ variables }) => {
  const { target, transactionToken } = variables.input;

  const user = db.user.findFirst({
    where: {
      email: {
        equals: target,
      },
    },
  });

  if (!user) {
    return HttpResponse.json({
      data: {
        finishLoginWith2FA: {
          error: AMBIGUOUS_INVALID_VERIFICATION_ERROR,
        },
      },
    });
  }

  if (transactionToken !== 'valid_transaction_token') {
    return HttpResponse.json({
      data: {
        finishLoginWith2FA: {
          error: AMBIGUOUS_INVALID_VERIFICATION_ERROR,
        },
      },
    });
  }

  const session = db.session.create({
    userID: user.id,
  });

  const accessToken = encodeMockJWT({
    sub: user.id,
    exp: Number.parseInt(
      (Date.now() + EXPIRATION_IN_MS).toString().slice(0, 10),
    ),
  });

  return HttpResponse.json({
    data: {
      finishLoginWith2FA: {
        accessToken,
        refreshToken: session.refreshToken,
        session: {
          ...session,
          user: addUserResolvedFields(user),
        },
      },
    },
  });
});
