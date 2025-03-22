import { createId } from '@paralleldrive/cuid2';
import type {
  ActivityData,
  EnemyGroup,
  EnemyGroupState,
  SimulationContext,
} from '~/types';
import { getRandomEnemies } from './get-random-enemies';

export function createEnemyGroup(
  activity: ActivityData,
  ctx: SimulationContext,
  enemyCount: number,
): EnemyGroup {
  const id = createId();
  const enemies = getRandomEnemies(activity, enemyCount, ctx);

  const getRemainingEnemies = () => {
    return enemies.filter((enemy) => enemy.isAlive);
  };

  const getState = (): EnemyGroupState => {
    return {
      enemies: enemies.map((enemy) => enemy.getState()),
      id,
    };
  };

  return {
    // meta
    enemies,
    id,

    // getters
    get nextLivingEnemy() {
      return getRemainingEnemies()[0] ?? null;
    },
    get remaining() {
      return getRemainingEnemies().length;
    },

    // core
    getState,
  };
}
