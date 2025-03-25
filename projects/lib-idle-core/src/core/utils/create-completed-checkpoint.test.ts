import { expect, test } from 'vitest';
import { createMockSimulationContext } from '../../test-utils/create-mock-simulation-context';
import { ActivityCheckpointType } from '../../types';
import { hashObject } from '../../utils/hash-object';
import { createCompletedCheckpoint } from './create-completed-checkpoint';

test('it creates a completed checkpoint', () => {
  const ctx = createMockSimulationContext();

  const checkpoint = createCompletedCheckpoint(2500, ctx);

  expect(checkpoint).toStrictEqual({
    hash: expect.any(String),
    nextSeed: expect.any(Number),
    time: 2500,
    type: ActivityCheckpointType.Completed,
  });
});

test('it includes a hash based on checkpoint data', () => {
  const ctx = createMockSimulationContext();

  const checkpoint = createCompletedCheckpoint(2500, ctx);

  const { hash, ...hashParts } = checkpoint;

  expect(hash).toStrictEqual(hashObject(ctx.hasher, hashParts));
});
