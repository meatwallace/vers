import { redirect } from 'react-router';
import { classes } from '@vers/data';
import { Heading, Text } from '@vers/design-system';
import { ContentContainer } from '~/components/content-container';
import { RouteErrorBoundary } from '~/components/route-error-boundary';
import { GetAvatarsQuery } from '~/data/queries/get-avatars';
import { resolveClassFromGQLEnum } from '~/data/utils/resolve-class-from-gql-enum.ts';
import { Routes } from '~/types';
import { requireAuth } from '~/utils/require-auth.server';
import { withErrorHandling } from '~/utils/with-error-handling';
import type { Route } from './+types/route';

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'vers | Avatar',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  const { data } = await args.context.client.query(GetAvatarsQuery, {
    input: {},
  });

  const avatar = data?.getAvatars[0];

  if (!avatar) {
    return redirect(Routes.AvatarCreate);
  }

  return {
    avatar: {
      ...avatar,
      class: resolveClassFromGQLEnum(avatar.class),
    },
  };
});

export function Avatar(props: Route.ComponentProps) {
  const { avatar } = props.loaderData;

  return (
    <ContentContainer>
      <Heading level={1}>{avatar.name}</Heading>
      <Text>Level {avatar.level}</Text>
      <Text>{classes[avatar.class].name}</Text>
      <Text>XP: {avatar.xp}</Text>
    </ContentContainer>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Avatar;
