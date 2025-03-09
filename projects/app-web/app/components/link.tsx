import type { ComponentProps } from 'react';
import { Link as RouterLink } from 'react-router';
import clsx from 'clsx';
import * as styles from './link.css.ts';

type Props = ComponentProps<typeof RouterLink>;

export function Link({ className, ...props }: Props) {
  return <RouterLink {...props} className={clsx(styles.link, className)} />;
}
