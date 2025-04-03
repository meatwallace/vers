import * as React from 'react';
import { cx } from '@vers/styled-system/css';
import * as styles from './content-container.styles.ts';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function ContentContainer(props: Props) {
  const { className, ...restProps } = props;

  return (
    <div className={cx(styles.container, className)} {...restProps}>
      {props.children}
    </div>
  );
}
