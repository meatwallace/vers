import { useLoaderData } from 'react-router';
import { redirect } from 'react-router';
import { type Route } from './+types/create.$worldID.ts';
import { graphql } from '~/gql';
import { Routes } from '~/types.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { requireAuth } from '~/utils/require-auth.server.ts';
import * as styles from './create.$worldID.css.ts';

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
    title: '',
    description: '',
  },
];

export function CreateWorldWizard() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <main className={styles.container}>
        {JSON.stringify(data.world, null, 2)}
      </main>
    </>
  );
}

export default CreateWorldWizard;
