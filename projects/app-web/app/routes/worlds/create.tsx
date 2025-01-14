import { redirect } from 'react-router';
import { graphql } from '../../gql';
import { client } from '../../client';
import { isMutationError } from '../../utils';
import { Routes } from '../../types';

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

export const action = async () => {
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
