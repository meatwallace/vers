import { style } from '@vanilla-extract/css';

export const forgotPasswordFormContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem',
});

export const forgotPasswordForm = style({
  width: '100%',
  maxWidth: '24rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  padding: '2rem',
});

export const forgotPasswordHeader = style({
  textAlign: 'center',
  marginBottom: '1.5rem',
});

export const forgotPasswordTitle = style({
  marginBottom: '0.5rem',
});

export const forgotPasswordSubtitle = style({});

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
