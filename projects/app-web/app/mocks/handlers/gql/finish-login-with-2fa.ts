import { graphql, HttpResponse } from 'msw';
import {
  FinishLoginWith2FaInput,
  FinishLoginWith2FaPayload,
} from '~/gql/graphql';
import { db } from '../../db';
import { UNKNOWN_ERROR } from '../../errors';
import { encodeMockJWT } from '../../utils/encode-mock-jwt';
import { addUserResolvedFields } from './utils/add-user-resolved-fields';

interface FinishLoginWith2FAVariables {
  input: FinishLoginWith2FaInput;
}

interface FinishLoginWith2FAResponse {
  finishLoginWith2FA: FinishLoginWith2FaPayload;
}

const EXPIRATION_IN_MS = 1000 * 60 * 60 * 24; // 24 hours

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
          error: UNKNOWN_ERROR,
        },
      },
    });
  }

  if (transactionToken !== 'valid_transaction_token') {
    return HttpResponse.json({
      data: {
        finishLoginWith2FA: {
          error: UNKNOWN_ERROR,
        },
      },
    });
  }

  const session = db.session.create({
    userID: user.id,
  });

  const accessToken = encodeMockJWT({
    exp: Number.parseInt(
      (Date.now() + EXPIRATION_IN_MS).toString().slice(0, 10),
    ),
    sub: user.id,
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
