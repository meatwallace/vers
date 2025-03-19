import * as React from 'react';
import { css, cx } from '@vers/styled-system/css';

export interface Props {
  children: React.ReactNode;
  className?: string;
}

const header = css({
  backgroundColor: 'neutral.900',
  display: 'flex',
  paddingBottom: '2',
  paddingTop: '4',
  paddingX: '6',
  roundedTop: 'md',
});

export function CardHeader(props: Props) {
  return <div className={cx(header, props.className)}>{props.children}</div>;
}
