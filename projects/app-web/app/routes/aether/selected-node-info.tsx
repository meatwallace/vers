import { useSelectedNode } from '@vers/aether-client';
import { BackgroundPattern, Button, Link, Text } from '@vers/design-system';
import { cx } from '@vers/styled-system/css';
import { Routes } from '~/types.ts';
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
        <Button
          // @ts-expect-error - polymorphic component issues. not worth it
          as={Link}
          className={styles.startButton}
          size="sm"
          to={Routes.AetherNode}
          variant="primary"
        >
          Click to start
        </Button>
      </div>
    </div>
  );
}
