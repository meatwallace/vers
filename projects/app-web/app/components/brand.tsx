import { RecipeVariants } from '@vanilla-extract/recipes';
import clsx from 'clsx';
import * as styles from './brand.css.ts';

type Props = RecipeVariants<typeof styles.container> & {
  className?: string;
};

export function Brand(props: Props) {
  return (
    <h1
      className={clsx(styles.container({ size: props.size }), props.className)}
    >
      vers
    </h1>
  );
}
