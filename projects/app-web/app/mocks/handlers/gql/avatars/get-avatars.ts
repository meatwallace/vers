import { graphql, HttpResponse } from 'msw';
import type { Avatar, GetAvatarsInput } from '~/gql/graphql';
import { resolveGQLEnumFromClass } from '~/data/utils/resolve-gql-enum-from-class';
import { db } from '../../../db';
import { decodeMockJWT } from '../../../utils/decode-mock-jwt';
import { resolveUserByID } from '../utils/resolve-user-by-id';

interface GetAvatarsVariables {
  input: GetAvatarsInput;
}

interface GetAvatarsResponse {
  getAvatars: Array<Avatar>;
}

export const GetAvatars = graphql.query<
  GetAvatarsResponse,
  GetAvatarsVariables
>('GetAvatars', ({ request }) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return HttpResponse.json({
      errors: [{ message: 'Unauthorized' }],
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = decodeMockJWT(token);

  const avatars = db.avatar.findMany({
    where: { userID: { equals: payload.sub } },
  });

  const resolvedAvatars = avatars.map((avatar) => ({
    ...avatar,
    class: resolveGQLEnumFromClass(avatar.class),
    user: resolveUserByID(avatar.userID),
  }));

  return HttpResponse.json({
    data: {
      getAvatars: resolvedAvatars,
    },
  });
});
