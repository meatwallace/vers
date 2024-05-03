import * as React from 'react';
import clsx from 'clsx';
import { RecipeVariants } from '@vanilla-extract/recipes';
import * as styles from './button.css.ts';

type Props = React.ComponentProps<'button'> &
  RecipeVariants<typeof styles.button>;

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, ...restProps }, forwardedRef) => {
    const buttonClassName = styles.button({
      color: restProps.color,
      size: restProps.size,
    });

    return (
      <button
        {...restProps}
        ref={forwardedRef}
        className={clsx(buttonClassName, className)}
      />
    );
  },
);

Button.displayName = 'Button';
