import { style } from '@vanilla-extract/css';

export const resetPasswordFormContainer = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem',
});

export const resetPasswordForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  maxWidth: '24rem',
  padding: '2rem',
  width: '100%',
});

export const resetPasswordHeader = style({
  marginBottom: '1.5rem',
  textAlign: 'center',
});

export const resetPasswordTitle = style({
  marginBottom: '0.5rem',
});

export const resetPasswordSubtitle = style({});

export const loginContainer = style({
  alignItems: 'center',
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'center',
  marginTop: '1rem',
});

export const loginText = style({});

export const loginLink = style({
  ':hover': {
    textDecoration: 'underline',
  },
  textDecoration: 'none',
});
