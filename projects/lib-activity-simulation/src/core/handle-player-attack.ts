import type { Enemy, PlayerAttackEvent, PlayerCharacter } from '~/types';
import { logger } from '~/utils/logger';

export function handlePlayerAttack(
  event: PlayerAttackEvent,
  character: PlayerCharacter,
  enemies: Array<Enemy>,
) {
  // find the first enemy that is alive
  const enemy = enemies.find((enemy) => enemy.isAlive);

  if (enemy) {
    const damage = character.getAttackDamage();

    enemy.receiveDamage(damage);

    logger.debug(
      `[player-attack] ${damage} damage to ${enemy.id} -> ${enemy.life} life`,
    );
  }
}
