import { expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { AetherNode } from '@vers/aether-core';
import { setHoveredNode } from './set-hovered-node';
import { useHoveredNodeStore } from './use-hovered-node-store';

test('it updates the hovered node in the store', () => {
  const node: AetherNode = {
    connections: [null, null, null, null],
    difficulty: 1,
    id: 'node1',
    index: 0,
    position: [0, 0] as [number, number],
    seed: 12_345,
  };

  setHoveredNode(node);

  const { result } = renderHook(() => useHoveredNodeStore((state) => state));

  expect(result.current).toStrictEqual({
    node,
  });
});
