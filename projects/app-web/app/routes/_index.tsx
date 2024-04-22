import { useLoaderData, json } from '@remix-run/react';
import { gql } from 'graphql-request';
import { MetaFunction } from '@remix-run/node';
import { client } from '../client';

const GetHelloWorld = gql`
  query GetHelloWorld {
    hello
  }
`;

type GetHelloResponse = {
  hello: string;
};

export const loader = async () => {
  const { hello } = await client.request<GetHelloResponse>(GetHelloWorld);

  return json({ hello });
};

export const meta: MetaFunction = () => [
  {
    title: '',
    description: '',
  },
];

export default function Index() {
  const { hello } = useLoaderData<GetHelloResponse>();

  return <div>{hello}</div>;
}
