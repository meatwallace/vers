import { style } from '@vanilla-extract/css';

export const link = style({
  color: '#2563eb',
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
});
