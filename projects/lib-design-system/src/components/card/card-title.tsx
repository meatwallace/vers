import * as React from 'react';
import { css, cx } from '@vers/styled-system/css';
import { Heading } from '../heading/heading';

export interface Props {
  children: React.ReactNode;
  className?: string;
}

const title = css({
  color: 'neutral.300',
});

export function CardTitle(props: Props) {
  return (
    <Heading className={cx(title, props.className)} level={4}>
      {props.children}
    </Heading>
  );
}
