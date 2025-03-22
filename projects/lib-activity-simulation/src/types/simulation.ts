import {
  Activity,
  ActivityCheckpoint,
  ActivityData,
  ActivityState,
} from './activity';
import { RNG } from './core';
import { Character, CharacterState } from './entities';

export interface SerializableSimulationState {
  activity?: ActivityState;
  character: CharacterState;
}

export interface SimulationState {
  readonly activity: Activity | null;
  readonly character: Character;
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
  restartActivity: () => void;
  run: (time: number) => Promise<ActivityCheckpoint | null>;
  startActivity: (activityData: ActivityData) => void;
  stopActivity: () => Promise<void>;
}

export interface SimulationContext {
  get elapsed(): number;
  rng: RNG;
}

export type SimulationListener = (state: SimulationState) => void;
