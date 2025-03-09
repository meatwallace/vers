import * as React from 'react';
import { RecipeVariants } from '@vanilla-extract/recipes';
import clsx from 'clsx';
import * as styles from './button.css.ts';

export type Props = React.ComponentProps<'button'> &
  RecipeVariants<typeof styles.button>;

export function Button(props: Props) {
  const { className, ...restProps } = props;

  const buttonClassName = styles.button({
    color: restProps.color,
    size: restProps.size,
  });

  return <button {...restProps} className={clsx(buttonClassName, className)} />;
}
