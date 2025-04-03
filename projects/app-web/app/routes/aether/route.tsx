import * as React from 'react';
import { Spinner } from '@vers/design-system';
import * as styles from './route.styles.ts';

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
