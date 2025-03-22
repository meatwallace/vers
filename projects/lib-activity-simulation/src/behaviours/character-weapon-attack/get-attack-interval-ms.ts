import invariant from 'tiny-invariant';
import type { Character } from '~/types';

export function getAttackIntervalMS(entity: Character): number {
  invariant(entity.mainHandEquipment, 'no weapon equipped');

  return Math.round(1000 / entity.mainHandEquipment.speed);
}
