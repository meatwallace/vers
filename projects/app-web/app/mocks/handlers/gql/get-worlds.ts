import { graphql, HttpResponse } from 'msw';
import { jwtDecode } from 'jwt-decode';
import { World } from '../../../gql/graphql';
import { db } from '../../db';

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
    const payload = jwtDecode(token);
    const user = db.user.findFirst({
      where: { auth0ID: { equals: payload.sub } },
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
