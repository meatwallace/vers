import type { Character, PlayerWeaponAttackBehaviourState } from '~/types';
import { getAttackIntervalMS } from './get-attack-interval-ms';

export function getNextAttackTime(
  entity: Character,
  state: PlayerWeaponAttackBehaviourState,
): number {
  return state.lastAttackTime + getAttackIntervalMS(entity);
}
