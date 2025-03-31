import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { AetherNode } from '@vers/aether-core';
import { nodeHasText } from '@vers/client-test-utils';
import { setHoveredNode } from '../state/set-hovered-node';
import { NodeTooltip } from './node-tooltip';

test('it displays information about the hovered node', () => {
  const node: AetherNode = {
    connections: ['conn1', null, 'conn2', null],
    difficulty: 2,
    id: 'node123',
    index: 3,
    position: [1.2345, 6.789],
    seed: 12_345,
  };

  setHoveredNode(node);

  render(<NodeTooltip />);

  const nodeID = screen.getByText('Test Aether Node (node123)');
  const [difficulty] = screen.getAllByText(nodeHasText('Difficulty 2'));

  expect(nodeID).toBeInTheDocument();
  expect(difficulty).toBeInTheDocument();
});
