import { BackgroundPattern, Text } from '@vers/design-system';
import { cx } from '@vers/styled-system/css';
import { useSelectedNode } from '../state/use-selected-node.ts';
import * as styles from './selected-node-info.styles.ts';

interface SelectedNodeInfoProps {
  className?: string;
}

export function SelectedNodeInfo(props: SelectedNodeInfoProps) {
  const { node } = useSelectedNode();

  if (!node) {
    return null;
  }

  return (
    <div className={cx(styles.container, props.className)}>
      <header className={styles.header}>
        <Text className={styles.name}>Test Aether Node ({node.id})</Text>
        <BackgroundPattern className={styles.headerBackground} />
      </header>

      <div className={styles.content}>
        <span className={styles.difficulty}>
          Difficulty <strong>{node.difficulty}</strong>
        </span>
      </div>
    </div>
  );
}
