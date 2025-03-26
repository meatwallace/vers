import * as React from 'react';
import { Link as RRLink } from 'react-router';
import { css, cx } from '@vers/styled-system/css';

export interface LinkBaseProps {
  children: React.ReactNode;
  to: string;
}

export type Props<T extends React.ElementType = typeof RRLink> = LinkBaseProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof LinkBaseProps> & {
    as?: T;
  };

export const link = css({
  _hover: {
    textDecoration: 'underline',
  },
  color: 'sky.500',
});

export function Link<T extends React.ElementType = typeof RRLink>(
  props: Props<T>,
) {
  const { as, className, ...restProps } = props;

  const Element = as ?? RRLink;

  return <Element {...restProps} className={cx(link, className)} />;
}
