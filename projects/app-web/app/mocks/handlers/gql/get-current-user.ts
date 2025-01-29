import { graphql, HttpResponse } from 'msw';
import { User } from '~/gql/graphql';
import { db } from '../../db';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

type GetCurrentUserResponse = {
  getCurrentUser: User;
};

type GetCurrentUserVariables = Record<PropertyKey, never>;

export const GetCurrentUser = graphql.query<
  GetCurrentUserResponse,
  GetCurrentUserVariables
>('GetCurrentUser', async ({ request }) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return HttpResponse.json({
      errors: [{ message: 'Unauthorized' }],
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = decodeMockJWT(token);

  const user = db.user.findFirst({
    where: { id: { equals: payload.sub } },
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
