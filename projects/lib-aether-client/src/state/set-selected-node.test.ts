import { expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { AetherNode } from '@vers/aether-core';
import { Object3D } from 'three';
import { setSelectedNode } from './set-selected-node';
import { useSelectedNodeStore } from './use-selected-node-store';

test('it updates the selected node in the store', () => {
  const node: AetherNode = {
    connections: [null, null, null, null],
    difficulty: 1,
    id: 'node1',
    index: 0,
    position: [0, 0] as [number, number],
    seed: 12_345,
  };

  const ref = new Object3D();

  setSelectedNode(node, ref);

  const { result } = renderHook(() => useSelectedNodeStore((state) => state));

  expect(result.current).toStrictEqual({
    node,
    object3D: ref,
  });
});
