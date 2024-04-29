import { style } from '@vanilla-extract/css';

export const container = style({
  margin: '0 auto',
  maxWidth: '1140px',
  padding: '0 24px',
  textAlign: 'center',
});

export const brandIcon = style({
  height: '42px',
  marginTop: '-2px',
  width: '42px',
});

export const brandName = style({
  alignSelf: 'center',
  color: '#0087ff',
  display: 'flex',
  fontFamily: 'Josefin Sans Medium, sans-serif',
  fontSize: '48px',
  fontWeight: 500,
  lineHeight: 1,
  padding: 0,
  textTransform: 'uppercase',
});

export const heroSection = style({
  alignItems: 'center',
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'center',
});

export const heroDescriptionContainer = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
});

export const heroDescriptionIcon = style({
  height: '192px',
  marginLeft: '-16px',
  width: '192px',
});

export const heroDescription = style({
  color: '#76a5ce',
  fontFamily: 'Karla Bold, sans-serif',
  fontSize: '36px',
  fontWeight: 600,
});

export const authSection = style({
  alignItems: 'center',
  display: 'flex',
  flexFlow: 'column',
  justifyContent: 'center',
});

export const existingAccountText = style({
  color: '#ddefff',
  fontFamily: 'Karla Regular, sans-serif',
  fontSize: '16px',
  fontWeight: 400,
  marginBottom: '8px',
});
