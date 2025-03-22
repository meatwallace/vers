import type {
  ActivityExecutor,
  CombatEvent,
  CombatExecutor,
  EnemyGroup,
  PlayerCharacter,
} from '~/types';
import { createEventSorter } from '~/core/utils/create-event-sorter';
import { handleEvent } from './handle-event';

export function createCombatExecutor(
  activityExecutor: ActivityExecutor,
  character: PlayerCharacter,
  enemyGroup: EnemyGroup,
): CombatExecutor {
  let elapsed = 0;

  let scheduledEvents: Array<CombatEvent> = [];

  const scheduleEvent = (event: CombatEvent) => {
    scheduledEvents.push(event);
  };

  const processEvents = (delta: number) => {
    const sortEvents = createEventSorter(character);

    scheduledEvents.sort(sortEvents);

    scheduledEvents.map((event: CombatEvent) => {
      handleEvent(event, character, enemyGroup.enemies);
    });

    scheduledEvents = [];

    elapsed += delta;
  };

  const executor = {
    get elapsed() {
      return elapsed;
    },
    run(delta: number) {
      run(this, delta);
    },
    scheduleEvent,
  } satisfies CombatExecutor;

  const run = (executor: CombatExecutor, delta: number) => {
    character.handleTick(executor);
    enemyGroup.enemies.map((enemy) => enemy.handleTick(executor));

    processEvents(delta);
  };

  return executor;
}
