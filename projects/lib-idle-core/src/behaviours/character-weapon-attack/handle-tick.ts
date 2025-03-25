import type {
  Character,
  CombatExecutor,
  PlayerWeaponAttackBehaviour,
} from '../../types';
import { createLogLabel } from '../../utils/create-log-label';
import { logger } from '../../utils/logger';
import { createCharacterAttackEvent } from './create-character-attack-event';
import { getNextAttackTime } from './get-next-attack-time';
import { isAttackReady } from './is-attack-ready';

export function handleTick(
  entity: Character,
  behaviour: PlayerWeaponAttackBehaviour,
  executor: CombatExecutor,
): void {
  const label = createLogLabel('character', entity.id);

  // loop to allow high APS to function correctly w/ server simulation batching
  while (isAttackReady(entity, behaviour.state, executor)) {
    const time = getNextAttackTime(entity, behaviour.state);
    const event = createCharacterAttackEvent(entity, time);

    executor.scheduleEvent(event);

    behaviour.setState((draft) => {
      draft.lastAttackTime = time;
    });

    logger.debug(`${label} scheduled attack at ${event.time}`);
  }
}
