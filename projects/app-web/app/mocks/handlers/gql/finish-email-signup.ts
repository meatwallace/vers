import { graphql, HttpResponse } from 'msw';
import { AuthPayload } from '~/gql/graphql';
import { db } from '../../db';
import { encodeMockJWT } from '../../utils/encode-mock-jwt';
import { MutationResponse } from './types';

type FinishEmailSignupResponse = MutationResponse<{
  finishEmailSignup: AuthPayload;
}>;

type FinishEmailSignupVariables = {
  input: {
    email: string;
    username: string;
    password: string;
    name: string;
  };
};

const EXPIRATION_IN_MS = 1000 * 60 * 60 * 24; // 1 day

export const FinishEmailSignup = graphql.mutation<
  FinishEmailSignupResponse,
  FinishEmailSignupVariables
>('FinishEmailSignup', async ({ variables }) => {
  const existingUser = db.user.findFirst({
    where: { email: { equals: variables.input.email } },
  });

  if (existingUser) {
    return HttpResponse.json({
      data: {
        finishEmailSignup: {
          error: {
            title: 'User already exists',
            message: 'A user already exists with this email',
          },
        },
      },
    });
  }

  const user = db.user.create({
    email: variables.input.email,
    username: variables.input.username,
    password: variables.input.password,
    name: variables.input.name,
  });

  const session = db.session.create({
    userID: user.id,
  });

  const accessToken = encodeMockJWT({
    sub: user.id,
    exp: Date.now() + EXPIRATION_IN_MS,
  });

  return HttpResponse.json({
    data: {
      finishEmailSignup: {
        refreshToken: session.refreshToken,
        accessToken,
        session: {
          ...session,
          user: user,
        },
      },
    },
  });
});
