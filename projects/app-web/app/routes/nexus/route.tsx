import { Heading, Link, Text } from '@vers/design-system';
import { ContentContainer } from '~/components/content-container';
import { RouteErrorBoundary } from '~/components/route-error-boundary';
import { GetAvatarsQuery } from '~/data/queries/get-avatars.ts';
import { Routes } from '~/types';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling';
import type { Route } from './+types/route';
import * as styles from './route.styles.ts';

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'vers | Nexus',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  const { data } = await args.context.client.query(GetAvatarsQuery, {
    input: {},
  });

  const avatar = data?.getAvatars[0] ?? null;

  return { avatar };
});

export function Nexus(props: Route.ComponentProps) {
  if (!props.loaderData.avatar) {
    return (
      <ContentContainer className={styles.container}>
        <Heading level={1}>Destiny Awaits a Vessel</Heading>
        <Text className={styles.tagline}>
          What is an Arbiter without a champion?
        </Text>
        <Text>
          Call forth your Avatar and guide their path across the Aether.
        </Text>
        <Link className={styles.link} to={Routes.AvatarCreate}>
          Awaken your Avatar
        </Link>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer className={styles.container}>
      <Heading level={2}>Nexus</Heading>
      <Text>vers is a work in progress. Check back often for updates.</Text>
    </ContentContainer>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Nexus;
