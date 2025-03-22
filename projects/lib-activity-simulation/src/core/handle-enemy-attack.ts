import type { Enemy, EnemyAttackEvent, PlayerCharacter } from '~/types';
import { logger } from '~/utils/logger';

export function handleEnemyAttack(
  event: EnemyAttackEvent,
  character: PlayerCharacter,
  enemies: Array<Enemy>,
) {
  const enemy = enemies.find((enemy) => enemy.id === event.source);

  if (enemy?.isAlive && character.isAlive) {
    const damage = enemy.getAttackDamage();

    character.receiveDamage(damage);

    logger.debug(
      `[enemy-attack] ${damage} damage to ${character.id} -> ${character.life} life`,
    );
  }
}
