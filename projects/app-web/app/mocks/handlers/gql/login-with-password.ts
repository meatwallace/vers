import { HttpResponse, graphql } from 'msw';
import {
  LoginWithPasswordInput,
  LoginWithPasswordPayload,
} from '~/gql/graphql';
import { db } from '../../db';
import { encodeMockJWT } from '../../utils/encode-mock-jwt';
import { addUserResolvedFields } from './utils/add-user-resolved-fields';

interface LoginWithPasswordVariables {
  input: LoginWithPasswordInput;
}

interface LoginWithPasswordResponse {
  loginWithPassword: LoginWithPasswordPayload;
}

const EXPIRATION_IN_MS = 1000 * 60 * 60 * 24; // 24 hours

export const LoginWithPassword = graphql.mutation<
  LoginWithPasswordResponse,
  LoginWithPasswordVariables
>('LoginWithPassword', ({ variables }) => {
  const { email, password } = variables.input;

  const user = db.user.findFirst({
    where: {
      email: {
        equals: email,
      },
    },
  });

  if (!user) {
    return HttpResponse.json({
      data: {
        loginWithPassword: {
          error: {
            title: 'Invalid credentials',
            message: 'No user with that email',
          },
        },
      },
    });
  }

  if (user.password !== password) {
    return HttpResponse.json({
      data: {
        loginWithPassword: {
          error: {
            title: 'Invalid credentials',
            message: 'Incorrect password',
          },
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
      loginWithPassword: {
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
