import xxhash from 'xxhash-wasm';
import type { SimulationContext } from '../types';
import { createRNG } from '../utils/create-rng';

const hasher = await xxhash();

type Overrides = Omit<Partial<SimulationContext>, 'hasher'>;

export function createMockSimulationContext(
  overrides: Overrides = {},
): SimulationContext {
  const ctx: SimulationContext = {
    elapsed: 0,
    hasher,
    rng: createRNG(999_999_999),
    ...overrides,
  };

  return ctx;
}
