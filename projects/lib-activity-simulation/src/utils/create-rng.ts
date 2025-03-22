import prand from 'pure-rand';
import type { RNG } from '../types';

/**
 * thin wrapper around pure-rand as it's interface is verbose and we don't need
 * most of it
 *
 * @param seed - the seed to create the rng with
 * @returns a thin wrapper around pure-rand
 */
export function createRNG(initialSeed: number): RNG {
  let rng = prand.xoroshiro128plus(initialSeed);

  const getInt = (min: number, max: number) => {
    return prand.unsafeUniformIntDistribution(min, max, rng);
  };

  const generateNewSeed = () => {
    const newSeed = getInt(0, 0x100000000);

    rng = prand.xoroshiro128plus(newSeed);

    return newSeed;
  };

  const getSeries = (min: number, max: number, count: number) => {
    return Array.from({ length: count }, () => getInt(min, max));
  };

  return {
    generateNewSeed,
    getInt,
    getSeries,
  };
}
