import { style } from '@vanilla-extract/css';

export const container = style({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: '1140px',
  paddingLeft: '24px',
  paddingRight: '24px',
  width: '100%',
});

export const singleLine = style({
  // display: 'block',
  whiteSpace: 'nowrap',
});
