import * as React from 'react';
import clsx from 'clsx';
import * as styles from './label.css.ts';

type Props = React.ComponentProps<'label'>;

export function Label({ className, htmlFor, ...restProps }: Props) {
  return (
    <label
      {...restProps}
      className={clsx(styles.label, className)}
      htmlFor={htmlFor}
    />
  );
}
