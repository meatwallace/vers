import type {
  Activity,
  Character,
  CombatEvent,
  CombatExecutor,
  SimulationContext,
} from '~/types';
import { createEventSorter } from '~/core/utils/create-event-sorter';
import { handleEvent } from './handle-event';

export function createCombatExecutor(
  activity: Activity,
  character: Character,
  ctx: SimulationContext,
): CombatExecutor {
  let elapsed = 0;
  let scheduledEvents: Array<CombatEvent> = [];

  const scheduleEvent = (event: CombatEvent) => {
    scheduledEvents.push(event);
  };

  const processEvents = () => {
    const sortEvents = createEventSorter(character);

    scheduledEvents.sort(sortEvents);

    scheduledEvents.map((event: CombatEvent) => {
      handleEvent(event, character, activity, ctx);
    });

    scheduledEvents = [];
  };

  const reset = () => {
    elapsed = 0;

    character.reset({ soft: true });
  };

  const executor: CombatExecutor = {
    get elapsed() {
      return elapsed;
    },
    reset,
    run(delta: number) {
      run(delta);
    },
    scheduleEvent,
  };

  const run = (delta: number) => {
    elapsed += delta;

    character.handleTick(executor, ctx);
    activity.currentEnemyGroup.enemies.map((enemy) =>
      enemy.handleTick(executor, ctx),
    );

    processEvents();

    activity.elapseTime(delta);
  };

  return executor;
}
