import { HttpResponse, graphql } from 'msw';
import { GetWorldsInput, World } from '~/gql/graphql';
import { db } from '../../db';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

interface GetWorldsVariables {
  input: GetWorldsInput;
}

interface GetWorldsResponse {
  getWorlds: Array<World>;
}

export const GetWorlds = graphql.query<GetWorldsResponse, GetWorldsVariables>(
  'GetWorlds',
  ({ request }) => {
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
