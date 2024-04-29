import { useLoaderData, json } from '@remix-run/react';
import { MetaFunction } from '@remix-run/node';
import { client } from '../client';
import { graphql } from '../gql';
import { LogOutButton } from '../components';

const GetCurrentUser = graphql(/* GraphQL */ `
  query GetCurrentUser {
    getCurrentUser {
      id
      name
    }
  }
`);

export const loader = async () => {
  const { getCurrentUser } = await client.request(GetCurrentUser);

  return json({ user: getCurrentUser });
};

export const meta: MetaFunction = () => [
  {
    title: '',
    description: '',
  },
];

export function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <div>Hello, {user.name}</div>
      <LogOutButton />
    </>
  );
}

export default Dashboard;
