import * as styles from './node-tooltip.styles.ts';
import { useHoveredNode } from './use-hovered-node';

export function NodeTooltip() {
  const node = useHoveredNode();

  if (!node) {
    return null;
  }

  return <div className={styles.container}>NodeTooltip</div>;
}
