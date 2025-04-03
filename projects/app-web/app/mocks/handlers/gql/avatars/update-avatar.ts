import { graphql, HttpResponse } from 'msw';
import type { UpdateAvatarInput, UpdateAvatarPayload } from '~/gql/graphql';
import { db } from '../../../db';
import { AVATAR_NAME_EXISTS_ERROR } from '../../../errors';
import { decodeMockJWT } from '../../../utils/decode-mock-jwt';

interface UpdateAvatarVariables {
  input: UpdateAvatarInput;
}

interface UpdateAvatarResponse {
  updateAvatar: UpdateAvatarPayload;
}

export const UpdateAvatar = graphql.mutation<
  UpdateAvatarResponse,
  UpdateAvatarVariables
>('UpdateAvatar', ({ request, variables }) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return HttpResponse.json({
      errors: [{ message: 'Unauthorized' }],
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = decodeMockJWT(token);

  const avatar = db.avatar.findFirst({
    where: { id: { equals: variables.input.id } },
  });

  if (!avatar || avatar.userID !== payload.sub) {
    return HttpResponse.json({
      data: {
        updateAvatar: {
          success: false,
        },
      },
    });
  }

  const existingAvatarWithName = db.avatar.findFirst({
    where: {
      id: { notEquals: variables.input.id },
      name: { equals: variables.input.name },
    },
  });

  if (existingAvatarWithName) {
    return HttpResponse.json({
      data: {
        updateAvatar: {
          error: AVATAR_NAME_EXISTS_ERROR,
        },
      },
    });
  }

  db.avatar.update({
    data: { name: variables.input.name },
    where: { id: { equals: variables.input.id } },
  });

  return HttpResponse.json({
    data: {
      updateAvatar: {
        success: true,
      },
    },
  });
});
