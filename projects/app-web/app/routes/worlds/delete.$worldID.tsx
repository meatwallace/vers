import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { graphql } from '../../gql';
import { client } from '../../client';
import { isMutationError } from '../../utils';
import { Routes } from '../../types';

const DeleteWorldMutation = graphql(/* GraphQL */ `
  mutation DeleteWorld($input: DeleteWorldInput!) {
    deleteWorld(input: $input) {
      ... on DeleteWorldSuccessPayload {
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

export const action = async ({ params }: ActionFunctionArgs) => {
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
