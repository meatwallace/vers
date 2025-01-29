import { graphql, HttpResponse } from 'msw';
import { db } from '../../db';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';
import { MutationResponse } from './types';

type DeleteWorldResponse = MutationResponse<{
  deleteWorld: {
    success: boolean;
  };
}>;

type DeleteWorldVariables = {
  input: {
    worldID: string;
  };
};

export const DeleteWorld = graphql.mutation<
  DeleteWorldResponse,
  DeleteWorldVariables
>('DeleteWorld', async ({ request, variables }) => {
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

  db.world.delete({
    where: {
      id: { equals: variables.input.worldID },
      ownerID: { equals: user.id },
    },
  });

  return HttpResponse.json({
    data: {
      deleteWorld: {
        success: true,
      },
    },
  });
});
