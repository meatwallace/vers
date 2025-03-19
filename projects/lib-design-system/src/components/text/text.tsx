import type { RecipeVariantProps, Styles } from '@vers/styled-system/css';
import { css, cva } from '@vers/styled-system/css';

export type Props = RecipeVariantProps<typeof text> & {
  as?: React.ElementType;
  bold?: boolean;
  children: React.ReactNode;
  css?: Styles;
};

const text = cva({
  base: {
    color: 'neutral.300',
    fontFamily: 'karla',
    fontSize: 'md',
    fontWeight: 'normal',
    lineHeight: 'normal',
    marginBottom: '2',
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
      className={css(
        text.raw({ align: props.align, bold: props.bold }),
        props.css,
      )}
    >
      {props.children}
    </Element>
  );
}
