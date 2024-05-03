import { recipe } from '@vanilla-extract/recipes';

export const container = recipe({
  base: {
    alignSelf: 'center',
    color: '#0087ff',
    display: 'flex',
    fontFamily: 'Josefin Sans, sans-serif',
    fontWeight: 500,
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  variants: {
    size: {
      small: {
        fontSize: '24px',
      },
      medium: {
        fontSize: '48px',
      },
      large: {
        fontSize: '72px',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export const icon = recipe({
  base: {},
  variants: {
    size: {
      small: {
        height: '22px',
        marginTop: '-2px',
        width: '22px',
      },
      medium: {
        height: '42px',
        marginTop: '-2px',
        width: '42px',
      },
      large: {
        height: '68px',
        marginTop: '-6px',
        width: '68px',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});
