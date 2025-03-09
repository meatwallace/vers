import { style } from '@vanilla-extract/css';

export const loginFormContainer = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem',
});

export const loginForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  maxWidth: '24rem',
  padding: '2rem',
  width: '100%',
});

export const loginHeader = style({
  marginBottom: '1.5rem',
  textAlign: 'center',
});

export const loginTitle = style({
  marginBottom: '0.5rem',
});

export const loginSubtitle = style({});

export const rememberMeContainer = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '-0.5rem',
});

export const forgotPasswordLink = style({
  ':hover': {
    textDecoration: 'underline',
  },
  textDecoration: 'none',
});

export const signupContainer = style({
  alignItems: 'center',
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'center',
  marginTop: '1rem',
});

export const signupText = style({});

export const signupLink = style({
  ':hover': {
    textDecoration: 'underline',
  },
  textDecoration: 'none',
});
