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
  defaultVariants: {
    size: 'medium',
  },
  variants: {
    size: {
      large: {
        fontSize: '72px',
      },
      medium: {
        fontSize: '48px',
      },
      small: {
        fontSize: '24px',
      },
    },
  },
});

export const icon = recipe({
  base: {},
  defaultVariants: {
    size: 'medium',
  },
  variants: {
    size: {
      large: {
        height: '68px',
        marginTop: '-6px',
        width: '68px',
      },
      medium: {
        height: '42px',
        marginTop: '-2px',
        width: '42px',
      },
      small: {
        height: '22px',
        marginTop: '-2px',
        width: '22px',
      },
    },
  },
});
