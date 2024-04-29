import { graphql, HttpResponse } from 'msw';
import { jwtDecode } from 'jwt-decode';
import { db } from '../../db';
import { MutationResponse } from './types';

type GetCurrentUserResponse = MutationResponse<{
  getCurrentUser: {
    id: string;
    auth0ID: string;
    email: string;
    emailVerified: boolean;
    name: string;
    firstName?: string;
    createdAt: Date;
  };
}>;

type GetOrCreateUserVariables = {
  //
};

export const GetCurrentUser = graphql.query<
  GetCurrentUserResponse,
  GetOrCreateUserVariables
>('GetCurrentUser', async ({ request }) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return HttpResponse.json({
      data: {
        getCurrentUser: {
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
  const user = db.user.findFirst({
    where: { auth0ID: { equals: payload.sub } },
  });

  if (!user) {
    return HttpResponse.json({
      data: {
        getCurrentUser: {
          error: {
            title: 'Not found',
            message: 'User not found',
          },
        },
      },
    });
  }

  return HttpResponse.json({
    data: {
      getCurrentUser: user,
    },
  });
});
