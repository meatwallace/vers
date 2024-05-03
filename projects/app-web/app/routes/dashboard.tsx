import { SyntheticEvent } from 'react';
import { Form, useFetcher, useLoaderData } from '@remix-run/react';
import { MetaFunction } from '@remix-run/node';
import { formatDistance } from 'date-fns';
import type { ArrayValues, Jsonify } from 'type-fest';
import { Header } from '../components/header';
import { graphql } from '../gql';
import type { GetWorldsQuery as GetWorldsQueryResponse } from '../gql/graphql';
import { client } from '../client';
import { Button } from '../components';
import * as styles from './dashboard.css.ts';
import { Routes } from '../types.ts';

const GetCurrentUserQuery = graphql(/* GraphQL */ `
  query GetCurrentUser {
    getCurrentUser {
      id
      name
      firstName
    }
  }
`);

const GetWorldsQuery = graphql(/* GraphQL */ `
  query GetWorlds($input: GetWorldsInput!) {
    getWorlds(input: $input) {
      id
      name
      updatedAt
    }
  }
`);

export async function loader() {
  const [{ getCurrentUser }, { getWorlds }] = await Promise.all([
    client.request(GetCurrentUserQuery),
    client.request(GetWorldsQuery, { input: {} }),
  ]);

  return { user: getCurrentUser, worlds: getWorlds };
}

export const meta: MetaFunction = () => [
  {
    title: '',
    description: '',
  },
];

export function Dashboard() {
  const { user, worlds } = useLoaderData<typeof loader>();
  const createWorldFetcher = useFetcher();

  const isCreatingWorld = createWorldFetcher.state !== 'idle';

  return (
    <>
      <Header user={user} />
      <main className={styles.container}>
        <section className={styles.worldsContainer}>
          <h2 className={styles.worldsHeader}>Your Worlds</h2>
          {/* CASE: user has worlds */}
          {worlds.length > 0 && (
            <>
              <div className={styles.worldsList}>
                {worlds.map((world) => (
                  <WorldListItem key={world.id} {...world} />
                ))}
              </div>
              <Form action="/worlds/create" method="post">
                <Button className={styles.createWorldButton} size="small">
                  Create World
                </Button>
              </Form>
            </>
          )}
          {/* CASE: user has no worlds */}
          {worlds.length === 0 && (
            <div className={styles.noWorldsContainer}>
              <p className={styles.noWorldsText}>
                You haven't created a world yet.
              </p>
              <createWorldFetcher.Form method="post" action="/worlds/create">
                <Button className={styles.noWorldCreateWorldButton}>
                  {isCreatingWorld ? 'Creating...' : 'Create world'}
                </Button>
              </createWorldFetcher.Form>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

type WorldListItemProps = ArrayValues<
  Jsonify<GetWorldsQueryResponse>['getWorlds']
> & {
  //
};

const handleDeleteWorld = (event: SyntheticEvent<HTMLFormElement>) => {
  const confirmed = confirm('Are you sure you want to delete this world?');

  if (!confirmed) {
    return event.preventDefault();
  }
};

function WorldListItem(props: WorldListItemProps) {
  const deleteWorldFetcher = useFetcher();

  const isDeleting = deleteWorldFetcher.state !== 'idle';

  return (
    <div className={styles.worldsListItem} key={props.id}>
      <span className={styles.worldName}>{props.name}</span>
      <span className={styles.singleLine}>
        <span className={styles.updatedAtLabel}>Updated: </span>
        <span className={styles.updatedAt}>
          {getDistanceFromNow(props.updatedAt)}
        </span>
      </span>
      <span className={styles.worldID}>{props.id}</span>
      {/* TODO: popout menu */}
      <deleteWorldFetcher.Form
        method="post"
        action={Routes.DeleteWorld.replace(':worldID', props.id)}
        onSubmit={handleDeleteWorld}
      >
        <Button size="small" className={styles.deleteWorldButton}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </deleteWorldFetcher.Form>
    </div>
  );
}

function getDistanceFromNow(date: string): string {
  const formatOpts = { includeSeconds: true, addSuffix: true };

  return formatDistance(new Date(date), new Date(), formatOpts);
}

export default Dashboard;
