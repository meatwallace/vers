import type { ActivityExecutor } from '~/types';
import { createRNG } from '~/utils/create-rng';

interface ExecutorConfig {
  seed: number;
}

export function createActivityExecutor(
  config: ExecutorConfig,
): ActivityExecutor {
  let elapsed = 0;

  const rng = createRNG(config.seed);

  const tick = (delta: number) => {
    elapsed += delta;
  };

  return {
    get elapsed() {
      return elapsed;
    },
    rng,
    tick,
  };
}
