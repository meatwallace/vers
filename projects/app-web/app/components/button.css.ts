import { style, styleVariants } from '@vanilla-extract/css';

const buttonBase = style({
  borderRadius: '4px',
  display: 'flex',
  fontFamily: 'Josefin Slab Bold, sans-serif',
  fontSize: '18px',
  justifyContent: 'center',
  marginBottom: '8px',
  minWidth: '160px',
  padding: '13px 16px 8px',
  textAlign: 'center',
  textTransform: 'uppercase',
});

export const buttonVariants = styleVariants({
  primary: [
    buttonBase,
    {
      backgroundColor: '#0087ff',
      border: 'none',
      color: '#ddefff',
    },
  ],
  secondary: [
    buttonBase,
    {
      backgroundColor: '#ffffff0d',
      border: '1px solid #0087ff',
      color: '#0087ff',
    },
  ],
  transparent: [
    buttonBase,
    {
      backgroundColor: '#ffffff0d',
      border: '1px solid #0087ff',
      color: '#0087ff',
    },
  ],
});
