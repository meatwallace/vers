import * as React from 'react';
import { Link as RouterLink } from 'react-router';
import { css, cx } from '@vers/styled-system/css';

export type Props = React.ComponentProps<typeof RouterLink>;

export const link = css({
  _hover: {
    textDecoration: 'underline',
  },
  color: 'sky.500',
});

export function Link({ className, ...props }: Props) {
  return <RouterLink {...props} className={cx(link, className)} />;
}
