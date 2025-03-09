import { style } from '@vanilla-extract/css';

export const container = style({
  maxWidth: '800px',
  margin: '0 auto',
  padding: '1rem',
});

export const section = style({
  marginTop: '1.5rem',
  padding: '1rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '0.375rem',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  ':first-child': {
    marginTop: 0,
  },
});

export const profileInfo = style({
  marginTop: '1rem',
});

export const securityInfo = style({
  marginTop: '1rem',
});

export const twoFactorError = style({
  color: '#ef4444', // danger red
});
