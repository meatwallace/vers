import type { Avatar, PlayerWeaponAttackBehaviourState } from '../../types';
import { getAttackIntervalMS } from './get-attack-interval-ms';

export function getNextAttackTime(
  entity: Avatar,
  state: PlayerWeaponAttackBehaviourState,
): number {
  return state.lastAttackTime + getAttackIntervalMS(entity);
}
