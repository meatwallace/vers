import { HttpResponse, graphql } from 'msw';
import { DeleteWorldInput, DeleteWorldPayload } from '~/gql/graphql';
import { db } from '../../db';
import { decodeMockJWT } from '../../utils/decode-mock-jwt';

interface DeleteWorldVariables {
  input: DeleteWorldInput;
}

interface DeleteWorldResponse {
  deleteWorld: DeleteWorldPayload;
}

export const DeleteWorld = graphql.mutation<
  DeleteWorldResponse,
  DeleteWorldVariables
>('DeleteWorld', ({ request, variables }) => {
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
