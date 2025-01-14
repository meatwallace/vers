import { useLoaderData } from 'react-router';
import { LoaderFunctionArgs, MetaFunction, redirect } from 'react-router';
import { graphql } from '../../gql/index';
import { client } from '../../client.ts';
import * as styles from './create.$worldID.css.ts';
import { Routes } from '../../types.ts';

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

export async function loader({ params }: LoaderFunctionArgs) {
  // this shouldn't happen - we should only reach here when a param is defined due to routing
  if (!params.worldID) {
    return redirect(Routes.Dashboard);
  }

  const { getWorld } = await client.request(GetCreatedWorldQuery, {
    input: { worldID: params.worldID },
  });

  return { world: getWorld };
}

export const meta: MetaFunction = () => [
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
