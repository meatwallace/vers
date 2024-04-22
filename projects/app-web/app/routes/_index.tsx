import { useLoaderData, json } from '@remix-run/react';
import { MetaFunction } from '@remix-run/node';
import { client } from '../client';
import { graphql } from '../gql';

const GetHelloWorld = graphql(/* GraphQL */ `
  query GetHelloWorld {
    hello
  }
`);

export const loader = async () => {
  const { hello } = await client.request(GetHelloWorld);

  return json({ hello });
};

export const meta: MetaFunction = () => [
  {
    title: '',
    description: '',
  },
];

export default function Index() {
  const { hello } = useLoaderData<typeof loader>();

  return <div>{hello}</div>;
}
