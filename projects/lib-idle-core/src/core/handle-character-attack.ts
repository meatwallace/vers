import type { Activity, Character, CharacterAttackEvent } from '../types';
import { createLogLabel } from '../utils/create-log-label';
import { logger } from '../utils/logger';

export function handleCharacterAttack(
  event: CharacterAttackEvent,
  character: Character,
  activity: Activity,
) {
  const label = createLogLabel('character', character.id);

  // find the first enemy that is alive
  const enemy = activity.currentEnemyGroup?.nextLivingEnemy;

  if (enemy) {
    const damage = character.calcAttackDamage();

    logger.debug(`${label} --> ${damage} damage to ${enemy.id}`);

    enemy.receiveDamage(damage);
  }
}
