import { graphql, HttpResponse } from 'msw';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../../gql/graphql';
import { db } from '../../db';

type GetCurrentUserResponse = {
  getCurrentUser: User;
};

type GetOrCreateUserVariables = Record<PropertyKey, never>;

export const GetCurrentUser = graphql.query<
  GetCurrentUserResponse,
  GetOrCreateUserVariables
>('GetCurrentUser', async ({ request }) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return HttpResponse.json({
      errors: [{ message: 'Unauthorized' }],
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = jwtDecode(token);
  const user = db.user.findFirst({
    where: { auth0ID: { equals: payload.sub } },
  });

  if (!user) {
    return HttpResponse.json({
      errors: [{ message: 'Internal Server Error' }],
    });
  }

  return HttpResponse.json({
    data: {
      getCurrentUser: user,
    },
  });
});
