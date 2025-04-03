import { graphql, HttpResponse } from 'msw';
import type { CreateAvatarInput, CreateAvatarPayload } from '~/gql/graphql';
import { resolveClassFromGQLEnum } from '~/data/utils/resolve-class-from-gql-enum';
import { resolveGQLEnumFromClass } from '~/data/utils/resolve-gql-enum-from-class';
import { db } from '../../../db';
import {
  AVATAR_LIMIT_REACHED_ERROR,
  AVATAR_NAME_EXISTS_ERROR,
} from '../../../errors';
import { decodeMockJWT } from '../../../utils/decode-mock-jwt';
import { resolveUserByID } from '../utils/resolve-user-by-id';

interface CreateAvatarVariables {
  input: CreateAvatarInput;
}

interface CreateAvatarResponse {
  createAvatar: CreateAvatarPayload;
}

const MAX_AVATARS = 2;

export const CreateAvatar = graphql.mutation<
  CreateAvatarResponse,
  CreateAvatarVariables
>('CreateAvatar', ({ request, variables }) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return HttpResponse.json({
      errors: [{ message: 'Unauthorized' }],
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = decodeMockJWT(token);

  const existingAvatars = db.avatar.findMany({
    where: { userID: { equals: payload.sub } },
  });

  if (existingAvatars.length >= MAX_AVATARS) {
    return HttpResponse.json({
      data: {
        createAvatar: {
          error: AVATAR_LIMIT_REACHED_ERROR,
        },
      },
    });
  }

  const existingAvatarWithName = db.avatar.findFirst({
    where: { name: { equals: variables.input.name } },
  });

  if (existingAvatarWithName) {
    return HttpResponse.json({
      data: {
        createAvatar: {
          error: AVATAR_NAME_EXISTS_ERROR,
        },
      },
    });
  }

  const avatar = db.avatar.create({
    class: resolveClassFromGQLEnum(variables.input.class),
    name: variables.input.name,
    userID: payload.sub,
  });

  return HttpResponse.json({
    data: {
      createAvatar: {
        ...avatar,
        class: resolveGQLEnumFromClass(avatar.class),
        user: resolveUserByID(avatar.userID),
      },
    },
  });
});
