import type { WritableDraft } from 'immer';

export interface RNG {
  generateNewSeed: () => number;
  getInt: (min: number, max: number) => number;
  getSeries: (min: number, max: number, count: number) => Array<number>;
  get seed(): number;
}

export type SetEntityStateFn<S extends object> = (
  state: WritableDraft<S>,
) => void;
