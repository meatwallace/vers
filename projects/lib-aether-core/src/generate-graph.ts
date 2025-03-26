import invariant from 'tiny-invariant';
import { createAetherNode } from './create-aether-node';
import { AetherGraph } from './types';

/**
 * Generates a graph of AetherNodes
 *
 * @param maxDifficulty - The maximum difficulty of the graph
 * @returns A graph of AetherNodes
 */
export function generateGraph(maxDifficulty: number): AetherGraph {
  const graph: AetherGraph = [];

  const centralNode = createAetherNode(0, 0);

  graph.push(centralNode);

  // generate all the nodes in our graph
  for (let difficulty = 1; difficulty <= maxDifficulty; difficulty++) {
    // linear growth in nodes per difficulty
    const nodesInLevel = 4 * difficulty;

    for (let i = 0; i < nodesInLevel; i++) {
      graph.push(createAetherNode(i, difficulty));
    }
  }

  // set all our connections
  for (const [i, node] of graph.entries()) {
    invariant(node, 'node is required');

    const nodesInCurrentLevel = 4 * node.difficulty;
    const nodesInPreviousLevel = 4 * (node.difficulty - 1);
    const nodesInNextLevel = 4 * (node.difficulty + 1);

    if (node.difficulty > 0) {
      let prevIndex1 = i - nodesInPreviousLevel - 1;
      const prevIndex2 = prevIndex1 + 1;

      const startIndexOfCurrentLevel = i - node.index;
      const startIndexOfPreviousLevel =
        startIndexOfCurrentLevel - nodesInPreviousLevel;

      // if the index we resolved is before the start of the previous difficulty,
      // we instead grab the final node of the next difficulty - almost like we
      // wrap around backwards
      if (prevIndex1 < startIndexOfPreviousLevel) {
        prevIndex1 =
          startIndexOfCurrentLevel + nodesInCurrentLevel + nodesInNextLevel - 1;
      }

      const nextIndex1 = i + nodesInCurrentLevel;
      const nextIndex2 = nextIndex1 + 1;

      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const connection1 = graph[prevIndex1]!;
      const connection2 = graph[prevIndex2]!;
      const connection3 = graph[nextIndex1]!;
      const connection4 = graph[nextIndex2]!;
      /* eslint-enable @typescript-eslint/no-non-null-assertion */

      node.connections = [connection1, connection2, connection3, connection4];
    }
  }

  // connect the central node to the first difficulty
  for (let i = 0; i < 4; i++) {
    const node = graph[i + 1];

    invariant(node, 'node is required');

    centralNode.connections[i] = node;
    node.connections[0] = centralNode;
  }

  return graph;
}
