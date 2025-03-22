import type { PlayerWeaponAttackBehaviourState } from '~/types';

export function getInitialState(): PlayerWeaponAttackBehaviourState {
  return {
    lastAttackTime: 0,
  };
}
