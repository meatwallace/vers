import type { ActivityData, EnemyGroup, SimulationContext } from '~/types';
import { createEnemyGroup } from './create-enemy-group';
import { getRandomEnemyGroupCount } from './get-random-enemy-group-count';

const MIN_ENEMIES = 3;
const MAX_ENEMIES = 6;

interface ActivityConfig {
  groupCount?: number;
  groupSize?: number;
}

export function getEnemyGroups(
  activity: ActivityData,
  ctx: SimulationContext,
  config: ActivityConfig,
): Array<EnemyGroup> {
  const enemyGroupCount = config.groupCount ?? getRandomEnemyGroupCount(ctx);

  return Array.from({ length: enemyGroupCount }, () => {
    const enemyCount =
      config.groupSize ?? ctx.rng.getInt(MIN_ENEMIES, MAX_ENEMIES);

    return createEnemyGroup(activity, ctx, enemyCount);
  });
}
