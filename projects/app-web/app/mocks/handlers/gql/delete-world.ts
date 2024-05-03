import { graphql, HttpResponse } from 'msw';
import { jwtDecode } from 'jwt-decode';
import { db } from '../../db';
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
  const payload = jwtDecode(token);

  const user = db.user.findFirst({
    where: { auth0ID: { equals: payload.sub } },
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
