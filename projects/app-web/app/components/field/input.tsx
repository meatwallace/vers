import * as React from 'react';
import clsx from 'clsx';
import * as styles from './input.css.ts';

type Props = React.ComponentProps<'input'>;

export function Input(props: Props) {
  const { className, ...restProps } = props;

  return <input {...restProps} className={clsx(styles.input, className)} />;
}
