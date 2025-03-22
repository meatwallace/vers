import { createId } from '@paralleldrive/cuid2';
import type {
  ActivityCheckpoint,
  ActivityData,
  ActivityExecutor,
  EnemyGroup,
  PlayerCharacterData,
} from '~/types';
import { createPlayerCharacter } from '~/entities/create-player-character';
import { logger } from '~/utils/logger';
import { createActivityExecutor } from './create-activity-executor';
import { createCombatExecutor } from './create-combat-executor';
import { createCompletedCheckpoint } from './utils/create-completed-checkpoint';
import { createEnemyGroupKilledCheckpoint } from './utils/create-enemy-group-killed-checkpoint';
import { createFailedCheckpoint } from './utils/create-failed-checkpoint';
import { createStartedCheckpoint } from './utils/create-started-checkpoint.';
import { getRandomEnemies } from './utils/get-random-enemies';

const MIN_ENEMY_GROUPS = 3;
const MAX_ENEMY_GROUPS = 6;
const MIN_ENEMIES = 3;
const MAX_ENEMIES = 6;
const SERVER_SIMULATION_INTERVAL = 100;

function getRandomEnemyGroupCount(executor: ActivityExecutor) {
  return executor.rng.getInt(MIN_ENEMY_GROUPS, MAX_ENEMY_GROUPS);
}

function getEnemyGroups(
  activity: ActivityData,
  executor: ActivityExecutor,
): Array<EnemyGroup> {
  const enemyGroupCount = getRandomEnemyGroupCount(executor);

  return Array.from({ length: enemyGroupCount }, () =>
    createEnemyGroup(activity, executor),
  );
}

function createEnemyGroup(
  activity: ActivityData,
  executor: ActivityExecutor,
): EnemyGroup {
  const enemyCount = executor.rng.getInt(MIN_ENEMIES, MAX_ENEMIES);
  const enemies = getRandomEnemies(activity, enemyCount, executor);

  const getRemainingEnemies = () => {
    return enemies.filter((enemy) => enemy.isAlive);
  };

  return {
    enemies,
    id: createId(),
    get nextLivingEnemy() {
      return getRemainingEnemies()[0];
    },
    get remaining() {
      return getRemainingEnemies().length;
    },
  };
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function* simulateActivity(
  activity: ActivityData,
  characterData: PlayerCharacterData,
  seed: number,
): AsyncGenerator<ActivityCheckpoint, ActivityCheckpoint> {
  const executor = createActivityExecutor({ seed });

  yield createStartedCheckpoint(seed);

  const character = createPlayerCharacter(characterData, executor);
  const enemyGroups: Array<EnemyGroup> = getEnemyGroups(activity, executor);

  const label = '[simulate-activity]';

  logger.debug(
    `${label} starting activity with ${enemyGroups.length} enemy groups`,
  );

  let currentEnemyGroupIdx = 0;

  const isEnemyGroupsRemaining = () => {
    return enemyGroups.some((group) => group.remaining > 0);
  };

  // initialize our combat executor with our first enemy group
  let combatExecutor = createCombatExecutor(
    executor,
    character,
    enemyGroups[0],
  );

  logger.debug(
    `${label} starting combat with first group of ${enemyGroups[0].enemies.length} enemies`,
  );

  while (character.isAlive && isEnemyGroupsRemaining()) {
    let currentEnemyGroup = enemyGroups[currentEnemyGroupIdx];

    if (currentEnemyGroup.remaining === 0) {
      yield createEnemyGroupKilledCheckpoint(executor);

      // move to the next enemy group
      currentEnemyGroupIdx++;
      currentEnemyGroup = enemyGroups[currentEnemyGroupIdx];

      logger.debug(
        `${label} moving to next enemy group of ${currentEnemyGroup.enemies.length} enemies`,
      );

      // initialize a new combat executor with our next enemy group
      combatExecutor = createCombatExecutor(
        executor,
        character,
        currentEnemyGroup,
      );
    }

    executor.tick(SERVER_SIMULATION_INTERVAL);

    combatExecutor.run(SERVER_SIMULATION_INTERVAL);
  }

  if (!character.isAlive) {
    return createFailedCheckpoint(executor);
  }

  return createCompletedCheckpoint(executor);
}
