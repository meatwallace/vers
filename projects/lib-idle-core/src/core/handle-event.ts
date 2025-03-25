import type {
  Activity,
  Character,
  CombatEvent,
  SimulationContext,
} from '../types';
import { CombatEventType } from '../types';
import { handleCharacterAttack } from './handle-character-attack';
import { handleEnemyAttack } from './handle-enemy-attack';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function handleEvent<T extends CombatEventType>(
  event: Extract<CombatEvent, { type: T }>,
  character: Character,
  activity: Activity,
  ctx: SimulationContext,
) {
  EVENT_HANDLER_FN[event.type](event, character, activity, ctx);
}

type EventHandlerMap = {
  [Type in CombatEventType]: (
    event: Extract<CombatEvent, { type: Type }>,
    character: Character,
    activity: Activity,
    ctx: SimulationContext,
  ) => void;
};

const EVENT_HANDLER_FN: EventHandlerMap = {
  [CombatEventType.CharacterAttack]: handleCharacterAttack,
  [CombatEventType.EnemyAttack]: handleEnemyAttack,
} as const;
