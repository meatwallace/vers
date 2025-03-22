import type { ActivityData, Enemy, SimulationContext } from '~/types';
import { createEnemy } from '~/entities/create-enemy';

export function getRandomEnemies(
  activity: ActivityData,
  count: number,
  ctx: SimulationContext,
): Array<Enemy> {
  if (activity.enemies.length === 1) {
    return Array.from({ length: count }, () =>
      createEnemy(activity.enemies[0], ctx),
    );
  }

  return ctx.rng
    .getSeries(0, activity.enemies.length - 1, count)
    .map((index) => createEnemy(activity.enemies[index], ctx));
}
