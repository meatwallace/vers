import type { RecipeVariantProps } from '@vers/styled-system/css';
import { cva, cx } from '@vers/styled-system/css';

export type Props = RecipeVariantProps<typeof text> & {
  as?: React.ElementType;
  bold?: boolean;
  children: React.ReactNode;
  className?: string;
};

const text = cva({
  base: {
    //
  },
  variants: {
    align: {
      center: {
        textAlign: 'center',
      },
      left: {
        textAlign: 'left',
      },
      right: {
        textAlign: 'right',
      },
    },
    bold: {
      true: {
        fontWeight: 'bold',
      },
    },
  },
});

export function Text(props: Props) {
  const Element = props.as ?? 'p';

  return (
    <Element
      className={cx(
        text({ align: props.align, bold: props.bold }),
        props.className,
      )}
    >
      {props.children}
    </Element>
  );
}
