import { useCallback } from 'react';
import { Button, Spinner, Text } from '@vers/design-system';
import {
  AetherNode,
  ClientMessageType,
  useActivity,
  useCharacter,
  useSimulationWorker,
} from '@vers/idle-client';
import { ContentContainer } from '~/components/content-container';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import type { Route } from './+types/route.ts';
import { activityData, characterData, initialSeed } from './data.ts';
import * as styles from './route.styles.ts';

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'vers | Nexus',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  return {};
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Nexus(props: Route.ComponentProps) {
  const worker = useSimulationWorker();

  const activity = useActivity();
  const character = useCharacter();

  const initializeSimulation = useCallback(() => {
    worker?.port.postMessage({
      character: characterData,
      seed: initialSeed,
      type: ClientMessageType.Initialize,
    });
  }, [worker]);

  const setActivity = useCallback(() => {
    worker?.port.postMessage({
      activity: activityData,
      type: ClientMessageType.SetActivity,
    });
  }, [worker]);

  if (!worker) {
    return <Spinner />;
  }

  if (!activity || !character) {
    return (
      <ContentContainer>
        <Text className={styles.infoText}>
          For all intents and purposes, this is just a test of the fundamental
          idle simulation & auto-battler. No character truly exists, nor is any
          data being synced. However, if you wish to see the work in progress,
          you can start the Aether Node.
        </Text>
        <Button
          className={styles.button}
          variant="primary"
          onClick={initializeSimulation}
        >
          1. Emulate Initial Data Fetch
        </Button>
        <Button
          className={styles.button}
          variant="primary"
          onClick={setActivity}
        >
          2. Start Aether Node
        </Button>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <AetherNode />
    </ContentContainer>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Nexus;
