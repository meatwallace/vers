import * as React from 'react';
import * as styles from './content-container.styles.ts';

interface Props {
  children: React.ReactNode;
}

export function ContentContainer(props: Props) {
  return <div className={styles.container}>{props.children}</div>;
}
