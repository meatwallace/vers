import * as React from 'react';
import type { RecipeVariantProps, Styles } from '@vers/styled-system/css';
import { cva, cx } from '@vers/styled-system/css';

export type ButtonBaseProps = RecipeVariantProps<typeof button> & {
  children: React.ReactNode;
  css?: Styles;
};

export type Props<T extends React.ElementType = 'button'> = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonBaseProps> & {
    as?: T;
  };

const button = cva({
  base: {
    _active: {
      transform: 'translateY(1px)',
    },
    _disabled: {
      _active: {
        transform: 'none',
      },
      _hover: {
        cursor: 'not-allowed',
      },
      cursor: 'not-allowed',
    },
    _hover: {
      cursor: 'pointer',
    },
    alignItems: 'center',
    borderWidth: '1',
    display: 'flex',
    fontFamily: 'karla',
    fontWeight: 'semibold',
    justifyContent: 'center',
    lineHeight: 'none',
    overflow: 'hidden',
    position: 'relative',
    rounded: 'sm',
    textAlign: 'center',
    userSelect: 'none',
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
  variants: {
    fullWidth: {
      true: {
        width: 'full',
      },
    },
    size: {
      lg: {
        fontSize: 'lg',
        height: '14',
        paddingX: '8',
        paddingY: '4',
      },
      md: {
        fontSize: 'md',
        height: '10',
        paddingX: '6',
        paddingY: '3',
      },
      sm: {
        fontSize: 'sm',
        height: '8',
        paddingX: '4',
        paddingY: '2',
      },
    },
    variant: {
      default: {
        _disabled: {
          _hover: {
            background: 'neutral.900',
          },
          background: 'neutral.900',
          borderColor: 'neutral.100/5',
          color: 'neutral.600',
        },
        _hover: {
          background: 'neutral.700',
        },
        background: 'neutral.800',
        borderColor: 'neutral.100/20',
        color: 'slate.100',
      },
      link: {
        _active: {
          transform: 'none',
        },
        _hover: {
          textDecoration: 'underline',
        },
        borderWidth: '0',
        color: 'sky.500',
        fontWeight: 'normal',
        padding: '0',
      },
      primary: {
        _disabled: {
          _hover: {
            background: 'sky.900',
          },
          background: 'sky.900',
          borderColor: 'neutral.100/5',
          color: 'neutral.900',
        },
        _hover: {
          background: 'sky.400',
        },
        background: 'sky.500',
        borderColor: 'neutral.100/20',
        color: 'neutral.900',
      },
      secondary: {
        _disabled: {
          _hover: {
            background: 'slate.800',
          },
          background: 'slate.800',
          borderColor: 'neutral.100/5',
          color: 'slate.600',
        },
        _hover: {
          background: 'slate.200',
        },
        background: 'slate.200',
        borderColor: 'neutral.100/20',
        color: 'slate.800',
      },
      tertiary: {
        _disabled: {
          _hover: {
            background: 'birch.900',
          },
          background: 'birch.900',
          borderColor: 'neutral.100/5',
          color: 'neutral.500',
        },
        _hover: {
          background: 'birch.300',
        },
        background: 'birch.400',
        borderColor: 'neutral.100/20',
        color: 'neutral.100',
      },
      transparent: {
        _hover: {
          background: 'transparent',
        },
        background: 'transparent',
        borderWidth: '0',
      },
    },
  },
});

export function Button<T extends React.ElementType = 'button'>(
  props: Props<T>,
) {
  const { as, className, fullWidth, size, variant, ...restProps } = props;

  const Element = as ?? 'button';

  return (
    <Element
      {...restProps}
      className={cx(button({ fullWidth, size, variant }), props.className)}
    />
  );
}
