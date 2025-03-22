import type { Activity, Character, EnemyAttackEvent } from '~/types';
import { createLogLabel } from '~/utils/create-log-label';
import { logger } from '~/utils/logger';

export function handleEnemyAttack(
  event: EnemyAttackEvent,
  character: Character,
  activity: Activity,
) {
  const enemy = activity.currentEnemyGroup.enemies.find(
    (enemy) => enemy.id === event.source,
  );

  if (enemy?.isAlive && character.isAlive) {
    const label = createLogLabel('enemy', event.source);

    const damage = enemy.calcAttackDamage();

    logger.debug(`${label} --> ${damage} damage to ${character.id}`);

    character.receiveDamage(damage);
  }
}
