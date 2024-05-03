import { graphql, HttpResponse } from 'msw';
import { jwtDecode } from 'jwt-decode';
import { createId } from '@paralleldrive/cuid2';
import { World } from '../../../gql/graphql';
import { db } from '../../db';
import { MutationResponse } from './types';

type CreateWorldResponse = MutationResponse<{
  createWorld: World;
}>;

type CreateWorldVariables = {
  input: Record<PropertyKey, never>;
};

export const CreateWorld = graphql.mutation<
  CreateWorldResponse,
  CreateWorldVariables
>('CreateWorld', async ({ request }) => {
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

  const world = db.world.create({
    id: createId(),
    ownerID: user.id,
  });

  return HttpResponse.json({
    data: {
      createWorld: world,
    },
  });
});
