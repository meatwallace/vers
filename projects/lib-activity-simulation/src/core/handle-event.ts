import type { CombatEvent, Enemy, PlayerCharacter } from '~/types';
import { CombatEventType } from '~/types';
import { handleEnemyAttack } from './handle-enemy-attack';
import { handlePlayerAttack } from './handle-player-attack';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function handleEvent<T extends CombatEventType>(
  event: Extract<CombatEvent, { type: T }>,
  character: PlayerCharacter,
  enemies: Array<Enemy>,
) {
  EVENT_HANDLER_FN[event.type](event, character, enemies);
}

type EventHandlerMap = {
  [Type in CombatEventType]: (
    event: Extract<CombatEvent, { type: Type }>,
    character: PlayerCharacter,
    enemies: Array<Enemy>,
  ) => void;
};

const EVENT_HANDLER_FN: EventHandlerMap = {
  [CombatEventType.EnemyAttack]: handleEnemyAttack,
  [CombatEventType.PlayerAttack]: handlePlayerAttack,
} as const;
