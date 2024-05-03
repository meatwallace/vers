import clsx from 'clsx';
import { RecipeVariants } from '@vanilla-extract/recipes';
import * as styles from './brand.css.ts';

type Props = {
  className?: string;
} & RecipeVariants<typeof styles.container>;

export function Brand(props: Props) {
  return (
    <h1
      className={clsx(styles.container({ size: props.size }), props.className)}
    >
      Chron
      <img
        alt="Chrononomicon brand icon"
        src="/assets/images/brand-icon-light.png"
        className={styles.icon({ size: props.size })}
      />
      nomicon
    </h1>
  );
}
