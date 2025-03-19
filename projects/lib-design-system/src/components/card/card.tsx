import * as React from 'react';
import { css, cx } from '@vers/styled-system/css';
import { CardBody } from './card-body';
import { CardHeader } from './card-header';
import { CardTitle } from './card-title';

export interface Props {
  children: React.ReactNode;
  className?: string;
}

const container = css({
  backgroundColor: 'neutral.800',
  borderColor: 'neutral.700',
  borderWidth: '1',
  boxShadow: 'md',
  maxWidth: '96',
  rounded: 'md',
});

export function Card(props: Props) {
  return <div className={cx(container, props.className)}>{props.children}</div>;
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
