import type { XXHashAPI } from 'xxhash-wasm';
import type {
  Activity,
  ActivityAppState,
  ActivityCheckpoint,
  ActivityData,
} from './activity';
import type { CombatExecutor, CombatExecutorAppState } from './combat';
import type { RNG } from './core';
import type { Character, CharacterAppState } from './entities';

export interface SimulationAppState {
  activity?: ActivityAppState;
  character: CharacterAppState;
  combat?: CombatExecutorAppState;
}

export interface SimulationState {
  readonly activity: Activity | null;
  readonly character: Character;
  readonly combat: CombatExecutor | null;
  readonly elapsed: number;
}

export type SimulationEventName =
  | 'restarted'
  | 'started'
  | 'stopped'
  | 'updated';

export interface Simulation {
  // meta
  readonly rng: RNG;

  // getters
  get activity(): Activity | null;
  get ctx(): SimulationContext;
  get elapsed(): number;
  get seed(): number;
  get state(): SimulationState;

  // utils
  addEventListener: (
    eventName: SimulationEventName,
    listener: SimulationListener,
  ) => void;
  getAppState: () => SimulationAppState;
  restartActivity: () => void;
  run: (time: number) => Promise<ActivityCheckpoint | null>;
  startActivity: (activityData: ActivityData) => void;
  stopActivity: () => Promise<void>;
}

export interface SimulationContext {
  get elapsed(): number;
  hasher: XXHashAPI;
  rng: RNG;
}

export type SimulationListener = (state: SimulationState) => void;
