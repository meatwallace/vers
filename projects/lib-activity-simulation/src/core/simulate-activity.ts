import invariant from 'tiny-invariant';
import type {
  Activity,
  ActivityCheckpointGenerator,
  Character,
  SimulationContext,
} from '~/types';
import { logger } from '~/utils/logger';
import { createCombatExecutor } from './create-combat-executor';
import { createCompletedCheckpoint } from './utils/create-completed-checkpoint';
import { createEnemyGroupKilledCheckpoint } from './utils/create-enemy-group-killed-checkpoint';
import { createFailedCheckpoint } from './utils/create-failed-checkpoint';
import { createStartedCheckpoint } from './utils/create-started-checkpoint';

// eslint-disable-next-line @typescript-eslint/require-await
export async function* simulateActivity(
  activity: Activity,
  character: Character,
  ctx: SimulationContext,
): ActivityCheckpointGenerator {
  invariant(activity, 'activity is required');

  const timestep = yield createStartedCheckpoint(ctx);

  const label = `[activity:${activity.type}]`;

  logger.debug(
    `${label} starting activity with ${activity.enemyGroups.length} enemy groups`,
  );

  // initialize our combat executor with our first enemy group
  const combatExecutor = createCombatExecutor(activity, character, ctx);

  logger.debug(
    `${label} starting combat with first group of ${activity.currentEnemyGroup.enemies.length} enemies`,
  );

  while (character.isAlive && activity.isEnemyGroupsRemaining) {
    combatExecutor.run(timestep);

    if (activity.currentEnemyGroup.remaining === 0) {
      yield createEnemyGroupKilledCheckpoint(activity, ctx);

      logger.debug(`${label} moving to next enemy group`);

      // move to the next enemy group
      combatExecutor.reset();
      activity.moveToNextEnemyGroup();
    } else {
      yield null;
    }
  }

  if (!character.isAlive) {
    return createFailedCheckpoint(activity, ctx);
  }

  return createCompletedCheckpoint(activity.elapsed, ctx);
}
