import * as React from 'react';
import { css, cx } from '@vers/styled-system/css';

export interface Props {
  children: React.ReactNode;
  className?: string;
}

const container = css({
  paddingBottom: '6',
  paddingTop: '4',
  paddingX: '6',
});

export function CardBody(props: Props) {
  return <div className={cx(container, props.className)}>{props.children}</div>;
}
