import { graphql, HttpResponse } from 'msw';
import { World } from '~/gql/graphql';
import { db } from '../../db';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

type GetWorldsResponse = {
  getWorlds: Array<World>;
};

type GetWorldsVariables = Record<PropertyKey, never>;

export const GetWorlds = graphql.query<GetWorldsResponse, GetWorldsVariables>(
  'GetWorlds',
  async ({ request }) => {
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
        errors: [{ message: 'Unauthorized' }],
      });
    }

    const worlds = db.world.findMany({
      where: { ownerID: { equals: user.id } },
    });

    return HttpResponse.json({
      data: {
        getWorlds: worlds,
      },
    });
  },
);
