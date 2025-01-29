import { graphql, HttpResponse } from 'msw';
import { World } from '~/gql/graphql';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';
import { db } from '../../db';

type GetCreatedWorldResponse = {
  getWorld: World;
};

type GetCreatedWorldVariables = {
  input: {
    worldID: string;
  };
};

export const GetCreatedWorld = graphql.query<
  GetCreatedWorldResponse,
  GetCreatedWorldVariables
>('GetCreatedWorld', async ({ request, variables }) => {
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

  const world = db.world.findFirst({
    where: { id: { equals: variables.input.worldID } },
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
});
