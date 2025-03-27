import * as styles from './selected-node-info.styles.ts';
import { useSelectedNode } from './use-selected-node';

export function SelectedNodeInfo() {
  const { node } = useSelectedNode();

  return (
    <div className={styles.container}>
      <span style={{ display: 'block' }}>
        <strong>node:</strong> {node?.id}
      </span>
      <span style={{ display: 'block' }}>
        <strong>difficulty:</strong> {node?.difficulty}
      </span>
      <span style={{ display: 'block' }}>
        <strong>index:</strong> {node?.index}
      </span>
      <span style={{ display: 'block' }}>
        <strong>connections:</strong>
      </span>
      <span style={{ display: 'block' }}>
        <strong>position:</strong> {node?.position[0].toFixed(2)},{' '}
        {node?.position[1].toFixed(2)}
      </span>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {node?.connections
          .filter(Boolean)
          .map((connection) => <li key={connection}>{connection}</li>)}
      </ul>
    </div>
  );
}
