import { style } from '@vanilla-extract/css';

export const loginFormContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem',
});

export const loginForm = style({
  width: '100%',
  maxWidth: '24rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  padding: '2rem',
});

export const loginHeader = style({
  textAlign: 'center',
  marginBottom: '1.5rem',
});

export const loginTitle = style({
  marginBottom: '0.5rem',
});

export const loginSubtitle = style({});

export const rememberMeContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '-0.5rem',
});

export const signupContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  marginTop: '1rem',
});

export const signupText = style({});

export const signupLink = style({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
});
