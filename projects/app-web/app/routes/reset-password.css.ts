import { style } from '@vanilla-extract/css';

export const resetPasswordFormContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem',
});

export const resetPasswordForm = style({
  width: '100%',
  maxWidth: '24rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  padding: '2rem',
});

export const resetPasswordHeader = style({
  textAlign: 'center',
  marginBottom: '1.5rem',
});

export const resetPasswordTitle = style({
  marginBottom: '0.5rem',
});

export const resetPasswordSubtitle = style({});

export const loginContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  marginTop: '1rem',
});

export const loginText = style({});

export const loginLink = style({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
});
