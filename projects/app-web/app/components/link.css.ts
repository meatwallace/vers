import { style } from '@vanilla-extract/css';

export const link = style({
  ':hover': {
    textDecoration: 'underline',
  },
  color: '#2563eb',
  textDecoration: 'none',
});
