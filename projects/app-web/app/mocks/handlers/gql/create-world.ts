import { HttpResponse, graphql } from 'msw';
import { createId } from '@paralleldrive/cuid2';
import { CreateWorldInput, CreateWorldPayload } from '~/gql/graphql';
import { db } from '~/mocks/db';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

interface CreateWorldVariables {
  input: CreateWorldInput;
}

interface CreateWorldResponse {
  createWorld: CreateWorldPayload;
}

export const CreateWorld = graphql.mutation<
  CreateWorldResponse,
  CreateWorldVariables
>('CreateWorld', ({ request }) => {
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
