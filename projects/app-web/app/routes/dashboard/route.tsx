import { useCallback } from 'react';
import { Button, Spinner, Text } from '@vers/design-system';
import {
  AetherNode,
  ClientMessageType,
  useActivity,
  useCharacter,
  useSimulationWorker,
} from '@vers/idle-client';
import { css } from '@vers/styled-system/css';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import type { Route } from './+types/route.ts';
import { activityData, characterData, initialSeed } from './data.ts';

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'vers | Dashboard',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  return {};
});

const startContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6',
  textAlign: 'center',
  width: '96',
});

const container = css({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  height: '2xl',
  maxHeight: {
    // all pages have 24px top padding & 56px of header
    base: '[calc(100vh - 24px - 56px)]',
    lg: '2xl',
  },
  paddingBottom: '4',
  userSelect: 'none',
  width: 'full',
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Dashboard(props: Route.ComponentProps) {
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
      <div className={startContainer}>
        <Text>
          For all intents and purposes, this is just a test of the fundamental
          idle simulation & auto-battler. No character truly exists, nor is any
          data being synced. However, if you wish to see the work in progress,
          you can start the Aether Node.
        </Text>
        <Button variant="primary" onClick={initializeSimulation}>
          1. Emulate Initial Data Fetch
        </Button>
        <Button variant="primary" onClick={setActivity}>
          2. Start Aether Node
        </Button>
      </div>
    );
  }

  return (
    <div className={container}>
      <AetherNode />
    </div>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Dashboard;
