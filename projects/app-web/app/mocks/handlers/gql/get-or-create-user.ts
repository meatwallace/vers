import { graphql, HttpResponse } from 'msw';
import { jwtDecode } from 'jwt-decode';
import { createId } from '@paralleldrive/cuid2';
import { User } from '../../../gql/graphql';
import { db } from '../../db';
import { MutationResponse } from './types';

type GetOrCreateUserResponse = MutationResponse<{
  getOrCreateUser: User;
}>;

type GetOrCreateUserVariables = {
  input: {
    email: string;
  };
};

export const GetOrCreateUser = graphql.mutation<
  GetOrCreateUserResponse,
  GetOrCreateUserVariables
>('GetOrCreateUser', async ({ request, variables }) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return HttpResponse.json({
      data: {
        getOrCreateUser: {
          error: {
            title: 'Unauthorized',
            message: 'Access token not provided',
          },
        },
      },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = jwtDecode(token);

  const existingUser = db.user.findFirst({
    where: { email: { equals: variables.input.email } },
  });

  if (existingUser) {
    return HttpResponse.json({
      data: {
        getOrCreateUser: existingUser,
      },
    });
  }

  const user = db.user.create({
    id: createId(),
    auth0ID: payload.sub,
    email: variables.input.email,
  });

  return HttpResponse.json({
    data: {
      getOrCreateUser: user,
    },
  });
});
