import { keyframes, style } from '@vanilla-extract/css';

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

export const container = style({
  animation: `${spin} 1s linear infinite`,
});

export const circle = style({
  opacity: 0.25,
});

export const spinner = style({
  opacity: 0.75,
});
