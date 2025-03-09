import { redirect } from 'react-router';
import { graphql } from '~/gql';
import { Routes } from '~/types.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { type Route } from './+types/route.ts';
import * as styles from './route.css.ts';

const GetCreatedWorldQuery = graphql(/* GraphQL */ `
  query GetCreatedWorld($input: GetWorldInput!) {
    getWorld(input: $input) {
      id
      name
      fantasyType
      technologyLevel
      archetype
      population
      geographyType
      geographyFeatures
      createdAt
      updatedAt
    }
  }
`);

export async function loader({ params, request }: Route.LoaderArgs) {
  const client = createGQLClient();

  await requireAuth(request, { client });

  // this shouldn't happen - we should only reach here when a param is defined due to routing
  if (!params.worldID) {
    return redirect(Routes.Dashboard);
  }

  const { getWorld } = await client.request(GetCreatedWorldQuery, {
    input: { worldID: params.worldID },
  });

  return { world: getWorld };
}

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: '',
  },
];

export function CreateWorldWizard({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <main className={styles.container}>
        {JSON.stringify(loaderData.world, null, 2)}
      </main>
    </>
  );
}

export default CreateWorldWizard;
