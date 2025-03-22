import type { SimulationContext } from '~/types';
import { createRNG } from '~/utils/create-rng';

export function createMockSimulationContext(
  overrides: Partial<SimulationContext> = {},
): SimulationContext {
  const ctx: SimulationContext = {
    elapsed: 0,
    rng: createRNG(999_999_999),
    ...overrides,
  };

  return ctx;
}
