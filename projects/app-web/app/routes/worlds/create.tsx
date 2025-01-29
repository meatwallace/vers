import { redirect } from 'react-router';
import { type Route } from './+types/create';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { graphql } from '~/gql';
import { Routes } from '~/types';
import { isMutationError } from '~/utils/is-mutation-error';
import { requireAuth } from '~/utils/require-auth.server.ts';

const CreateWorldMutation = graphql(/* GraphQL */ `
  mutation CreateWorld($input: CreateWorldInput!) {
    createWorld(input: $input) {
      ... on World {
        id
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

export const action = async ({ request }: Route.ActionArgs) => {
  const client = createGQLClient();

  await requireAuth(request, { client });

  try {
    const { createWorld } = await client.request(CreateWorldMutation, {
      input: {},
    });

    // TODO(#22): handle failure gracefully
    if (isMutationError(createWorld)) {
      console.log(createWorld.error);

      return redirect(Routes.Dashboard);
    }

    return redirect(
      Routes.CreateWorldWizard.replace(':worldID', createWorld.id),
    );
  } catch (error) {
    // TODO(#22): handle failure gracefully
    console.log(error);

    return redirect(Routes.Dashboard);
  }
};
