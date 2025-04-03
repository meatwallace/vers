import { useEffect } from 'react';
import { redirect } from 'react-router';
import { classes } from '@vers/data';
import { Spinner } from '@vers/design-system';
import {
  AetherNode,
  createInitializeMessage,
  createSetActivityMessage,
  useActivity,
  useSimulationInitialized,
  useSimulationWorker,
} from '@vers/idle-client';
import { EquipmentSlot } from '@vers/idle-core';
import { ContentContainer } from '~/components/content-container';
import { GetAvatarsQuery } from '~/data/queries/get-avatars.ts';
import { resolveClassFromGQLEnum } from '~/data/utils/resolve-class-from-gql-enum.ts';
import { activityData } from '~/dummy-data.ts';
import { Routes } from '~/types.ts';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import type { Route } from './+types/route.ts';

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  const { data } = await args.context.client.query(GetAvatarsQuery, {
    input: {},
  });

  const avatar = data?.getAvatars[0];

  if (!avatar) {
    return redirect(Routes.AvatarCreate);
  }

  const classID = resolveClassFromGQLEnum(avatar.class);

  return {
    activity: activityData,
    avatar: {
      ...avatar,
      class: classID,
      image: classes[classID].images.unitFrame,
      life: 100,
      paperdoll: {
        [EquipmentSlot.MainHand]: {
          id: '1',
          maxDamage: 10,
          minDamage: 1,
          name: 'Test Item',
          speed: 1,
        },
      },
    },
  };
});

export function AetherNodeRoute(props: Route.ComponentProps) {
  const worker = useSimulationWorker();
  const initialized = useSimulationInitialized();
  const activity = useActivity();

  useEffect(() => {
    if (!worker) {
      return;
    }

    if (!initialized) {
      const message = createInitializeMessage();

      worker.port.postMessage(message);
    }

    if (initialized) {
      const message = createSetActivityMessage(
        props.loaderData.activity,
        props.loaderData.avatar,
      );

      worker.port.postMessage(message);
    }
  }, [worker, initialized, props.loaderData.activity, props.loaderData.avatar]);

  if (!activity || activity.id !== props.loaderData.activity.id) {
    return (
      <ContentContainer>
        <Spinner />
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <AetherNode />
    </ContentContainer>
  );
}

export default AetherNodeRoute;
