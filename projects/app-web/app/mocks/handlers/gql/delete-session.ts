import { graphql, HttpResponse } from 'msw';
import { MutationSuccess } from '~/gql/graphql';
import { db } from '~/mocks/db.ts';
import { MutationResponse } from './types';

type DeleteSessionResponse = MutationResponse<{
  deleteSession: MutationSuccess;
}>;

type DeleteSessionVariables = {
  input: {
    id: string;
  };
};

export const DeleteSession = graphql.mutation<
  DeleteSessionResponse,
  DeleteSessionVariables
>('DeleteSession', async ({ variables }) => {
  db.session.delete({
    where: {
      id: {
        equals: variables.input.id,
      },
    },
  });

  return HttpResponse.json({
    data: {
      deleteSession: {
        success: true,
      },
    },
  });
});
