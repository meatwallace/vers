import { graphql, HttpResponse } from 'msw';
import { jwtDecode } from 'jwt-decode';
import { World } from '../../../gql/graphql';
import { db } from '../../db';

type GetWorldResponse = {
  getWorld: World;
};

type GetWorldVariables = {
  input: {
    worldID: string;
  };
};

export const GetWorld = graphql.query<GetWorldResponse, GetWorldVariables>(
  /GetCreatedWorld/,
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

    const world = db.world.findFirst({
      where: { ownerID: { equals: user.id } },
    });

    if (!world) {
      return HttpResponse.json({
        errors: [{ message: 'World not found' }],
      });
    }

    return HttpResponse.json({
      data: {
        getWorld: world,
      },
    });
  },
);
