import type { ActivityData, ActivityExecutor, Enemy } from '~/types';
import { createEnemy } from '~/entities/create-enemy';

export function getRandomEnemies(
  activity: ActivityData,
  count: number,
  executor: ActivityExecutor,
): Array<Enemy> {
  if (activity.enemies.length === 1) {
    return Array.from({ length: count }, () =>
      createEnemy(activity.enemies[0], executor),
    );
  }

  return executor.rng
    .getSeries(0, activity.enemies.length - 1, count)
    .map((index) => createEnemy(activity.enemies[index], executor));
}
