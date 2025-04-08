import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useEventListener } from '@react-hookz/web';
import { Text, Tooltip } from '@vers/design-system';
import { useHoveredNode } from '../state/use-hovered-node';
import * as styles from './node-tooltip.styles';

interface NodeTooltipProps {
  className?: string;
}

const TOOLTIP_OFFSET = 10;

export function NodeTooltip(props: NodeTooltipProps) {
  const element = useRef<HTMLDivElement | null>(null);
  const node = useHoveredNode();
  const document = useDocument();

  useEventListener(document, 'mousemove', (e: MouseEvent) => {
    if (element.current) {
      const x = e.clientX + TOOLTIP_OFFSET;
      const y = e.clientY + TOOLTIP_OFFSET;

      element.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  if (!node || !document) {
    return null;
  }

  return createPortal(
    <Tooltip ref={element} className={props.className} variant="default">
      <Tooltip.Header>
        <Text className={styles.name}>Test Aether Node ({node?.id})</Text>
      </Tooltip.Header>
      <Tooltip.Content>
        <Text className={styles.difficulty}>
          Difficulty <strong>{node?.difficulty}</strong>
        </Text>
      </Tooltip.Content>
    </Tooltip>,
    document.body,
  );
}

// util to prevent us from having SSR issues with document not being defined
export function useDocument() {
  const [myDocument, setMyDocument] = useState<Document | null>(null);

  useEffect(() => {
    setMyDocument(document);
  }, []);

  return myDocument;
}
