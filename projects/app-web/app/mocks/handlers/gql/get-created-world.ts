import { HttpResponse, graphql } from 'msw';
import { GetWorldInput, World } from '~/gql/graphql';
import { db } from '../../db';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

interface GetCreatedWorldVariables {
  input: GetWorldInput;
}

interface GetCreatedWorldResponse {
  getWorld: World;
}

export const GetCreatedWorld = graphql.query<
  GetCreatedWorldResponse,
  GetCreatedWorldVariables
>('GetCreatedWorld', ({ request, variables }) => {
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
