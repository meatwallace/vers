import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  //
});

export const input = style({
  //
});

export const group = style({
  display: 'flex',
  //
});

export const separator = style({
  //
});

export const slot = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  width: '24px',
  height: '36px',
  border: '1px solid #000',
  marginLeft: '4px',
  marginRight: '4px',
});

export const activeSlot = style({
  //
});

export const caret = style({
  position: 'absolute',
  //
});

export const caretBlink = style({
  //
});
