import { deepEqual } from 'fast-equals';
import invariant from 'tiny-invariant';
import type {
  Activity,
  ActivityCheckpointGenerator,
  ActivityData,
  CharacterData,
  Simulation,
  SimulationContext,
  SimulationEventName,
  SimulationListener,
  SimulationState,
} from '~/types';
import { createCharacter } from '~/entities/create-character';
import { createRNG } from '~/utils/create-rng';
import { createActivity } from './create-activity';
import { simulateActivity } from './simulate-activity';
import { getSerializableState } from './utils/get-serializable-state';

export function createSimulation(
  characterData: CharacterData,
  seed: number,
): Simulation {
  const rng = createRNG(seed);

  let _activityData: ActivityData | null = null;
  let _activity: Activity | null = null;
  let _generator: ActivityCheckpointGenerator | null = null;
  let _done: boolean | undefined;
  let _elapsed = 0;

  const ctx: SimulationContext = {
    get elapsed() {
      return _elapsed;
    },
    rng,
  };

  const _character = createCharacter(characterData, ctx);

  const state: SimulationState = {
    get activity() {
      return _activity;
    },
    get character() {
      return _character;
    },
    get elapsed() {
      return _elapsed;
    },
  };

  const listeners: Record<SimulationEventName, Array<SimulationListener>> = {
    restarted: [],
    started: [],
    stopped: [],
    updated: [],
  };

  const startActivity = (activityData: ActivityData) => {
    _activityData = activityData;
    _activity = createActivity(activityData, ctx);
    _generator = simulateActivity(_activity, state.character, ctx);

    for (const listener of listeners.started) {
      listener(state);
    }
  };

  const stopActivity = async () => {
    _activity = null;

    if (!_done) {
      // @ts-expect-error - we're not passing a return value during cleanup
      await _generator?.return();
    }

    _done = true;

    for (const listener of listeners.stopped) {
      listener(state);
    }
  };

  const restartActivity = () => {
    invariant(_activityData, 'activity data is required');

    _character.reset();

    _activity = createActivity(_activityData, ctx);
    _generator = simulateActivity(_activity, state.character, ctx);

    for (const listener of listeners.restarted) {
      listener(state);
    }
  };

  const run = async (timestep: number) => {
    invariant(_generator, 'generator is required');

    const prevState = getSerializableState(state);

    const { done, value: checkpoint } = await _generator.next(timestep);

    _done = done;

    if (_done) {
      _generator = null;
    }

    const currentState = getSerializableState(state);

    if (!deepEqual(prevState, currentState)) {
      for (const listener of listeners.updated) {
        listener(state);
      }
    }

    _elapsed += timestep;

    return checkpoint;
  };

  return {
    // meta
    rng,

    // getters
    get activity() {
      return state.activity;
    },
    get ctx() {
      return ctx;
    },
    get elapsed(): number {
      return state.elapsed;
    },
    get seed(): number {
      return rng.seed;
    },
    get state() {
      return state;
    },

    // utils
    addEventListener: (
      eventName: SimulationEventName,
      listener: SimulationListener,
    ) => {
      listeners[eventName].push(listener);
    },
    restartActivity,
    run,
    startActivity,
    stopActivity,
  };
}
