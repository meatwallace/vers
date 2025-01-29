import { redirect } from 'react-router';
import { type Route } from './+types/delete.$worldID';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { graphql } from '~/gql';
import { Routes } from '~/types';
import { isMutationError } from '~/utils/is-mutation-error';
import { requireAuth } from '~/utils/require-auth.server.ts';

const DeleteWorldMutation = graphql(/* GraphQL */ `
  mutation DeleteWorld($input: DeleteWorldInput!) {
    deleteWorld(input: $input) {
      ... on MutationSuccess {
        success
      }

      ... on MutationErrorPayload {
        error {
          title
          message
        }
      }
    }
  }
`);

export const action = async ({ params, request }: Route.ActionArgs) => {
  const client = createGQLClient();

  await requireAuth(request, { client });

  // this shouldn't happen - we should only reach here when a param is defined due to routing
  if (!params.worldID) {
    return redirect(Routes.Dashboard);
  }

  try {
    const { deleteWorld } = await client.request(DeleteWorldMutation, {
      input: {
        worldID: params.worldID,
      },
    });

    // TODO(#22): handle failure gracefully
    if (isMutationError(deleteWorld)) {
      console.log(deleteWorld.error);

      return redirect(Routes.Dashboard);
    }

    return { success: true };
  } catch (error) {
    // TODO(#22): handle failure gracefully
    console.log(error);

    return redirect(Routes.Dashboard);
  }
};
