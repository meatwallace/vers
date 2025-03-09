import { HttpResponse, graphql } from 'msw';
import {
  FinishEmailSignupInput,
  FinishEmailSignupPayload,
} from '~/gql/graphql';
import { db } from '../../db';
import { encodeMockJWT } from '../../utils/encode-mock-jwt';
import { addUserResolvedFields } from './utils/add-user-resolved-fields';

interface FinishEmailSignupVariables {
  input: FinishEmailSignupInput;
}

interface FinishEmailSignupResponse {
  finishEmailSignup: FinishEmailSignupPayload;
}

const EXPIRATION_IN_MS = 1000 * 60 * 60 * 24; // 1 day

export const FinishEmailSignup = graphql.mutation<
  FinishEmailSignupResponse,
  FinishEmailSignupVariables
>('FinishEmailSignup', ({ variables }) => {
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

  const finishEmailSignup: FinishEmailSignupPayload = {
    refreshToken: session.refreshToken,
    accessToken,
    session: {
      ...session,
      user: addUserResolvedFields(user),
    },
  };

  return HttpResponse.json({ data: { finishEmailSignup } });
});
