import { graphql, HttpResponse } from 'msw';
import type { DeleteAvatarInput, DeleteAvatarPayload } from '~/gql/graphql';
import { db } from '../../../db';
import { decodeMockJWT } from '../../../utils/decode-mock-jwt';

interface DeleteAvatarVariables {
  input: DeleteAvatarInput;
}

interface DeleteAvatarResponse {
  deleteAvatar: DeleteAvatarPayload;
}

export const DeleteAvatar = graphql.mutation<
  DeleteAvatarResponse,
  DeleteAvatarVariables
>('DeleteAvatar', ({ request, variables }) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return HttpResponse.json({
      errors: [{ message: 'Unauthorized' }],
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = decodeMockJWT(token);

  db.avatar.delete({
    where: {
      id: { equals: variables.input.id },
      userID: { equals: payload.sub },
    },
  });

  return HttpResponse.json({
    data: {
      deleteAvatar: {
        success: true,
      },
    },
  });
});
