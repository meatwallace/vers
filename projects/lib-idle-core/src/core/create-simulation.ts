import type { XXHashAPI } from 'xxhash-wasm';
import { deepEqual } from 'fast-equals';
import invariant from 'tiny-invariant';
import type {
  Activity,
  ActivityCheckpointGenerator,
  ActivityData,
  CharacterData,
  CombatExecutor,
  Simulation,
  SimulationContext,
  SimulationEventName,
  SimulationListener,
  SimulationState,
} from '../types';
import { createCharacter } from '../entities/create-character';
import { createRNG } from '../utils/create-rng';
import { createActivity } from './create-activity';
import { createCombatExecutor } from './create-combat-executor';
import { simulateActivity } from './simulate-activity';
import { getAppState } from './utils/get-app-state';

export function createSimulation(
  characterData: CharacterData,
  seed: number,
  hasher: XXHashAPI,
): Simulation {
  const rng = createRNG(seed);

  let _activityData: ActivityData | null = null;
  let _activity: Activity | null = null;
  let _combat: CombatExecutor | null = null;
  let _generator: ActivityCheckpointGenerator | null = null;
  let _done: boolean | undefined;
  let _elapsed = 0;

  const ctx: SimulationContext = {
    get elapsed() {
      return _elapsed;
    },
    hasher,
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
    get combat() {
      return _combat;
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
    _combat = createCombatExecutor(_activity, state.character, ctx);
    _generator = simulateActivity(_combat, _activity, state.character, ctx);

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
    invariant(_combat, 'combat executor is required');

    _character.reset();

    _activity = createActivity(_activityData, ctx);
    _combat = createCombatExecutor(_activity, state.character, ctx);
    _generator = simulateActivity(_combat, _activity, state.character, ctx);

    for (const listener of listeners.restarted) {
      listener(state);
    }
  };

  const run = async (timestep: number) => {
    invariant(_generator, 'generator is required');
    invariant(_activity, 'activity is required');

    const prevState = getAppState(state);

    const { done, value: checkpoint } = await _generator.next(timestep);

    _done = done;

    if (_done) {
      _generator = null;
    }

    const currentState = getAppState(state);

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
    getAppState: () => getAppState(state),
    restartActivity,
    run,
    startActivity,
    stopActivity,
  };
}
