import * as React from 'react';
import type { CompressedAetherNode } from '@vers/aether-core';
import { setAetherGraph, setSelectedNode } from '@vers/aether-client';
import { data, decompressAetherNodes } from '@vers/aether-core';
import { Spinner } from '@vers/design-system';
import * as styles from './route.styles.ts';

const aetherGraph = decompressAetherNodes(data as Array<CompressedAetherNode>);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const firstNode = Object.values(aetherGraph.nodes)[0]!;

setAetherGraph(aetherGraph);
setSelectedNode(firstNode, null);

export function AetherRoute() {
  return (
    <div className={styles.container}>
      <React.Suspense fallback={<Spinner />}>
        <MemoizedAether />
      </React.Suspense>
    </div>
  );
}

const Aether = React.lazy(async () => {
  const module = await import('./aether.tsx');

  return { default: module.Aether };
});

const MemoizedAether = React.memo(Aether);

export default AetherRoute;
