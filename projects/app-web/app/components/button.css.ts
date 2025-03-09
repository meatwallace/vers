import { recipe } from '@vanilla-extract/recipes';

export const button = recipe({
  base: {
    borderRadius: '4px',
    display: 'flex',
    fontFamily: 'Josefin Slab, sans-serif',
    justifyContent: 'center',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  defaultVariants: {
    color: 'primary',
    size: 'medium',
  },
  variants: {
    color: {
      primary: {
        backgroundColor: '#0087ff',
        border: 'none',
        color: '#ddefff',
      },
      secondary: {
        backgroundColor: '#ffffff0d',
        border: '1px solid #0087ff',
        color: '#0087ff',
      },
      transparent: {
        backgroundColor: '#ffffff0d',
        border: '1px solid #0087ff',
        color: '#0087ff',
      },
    },
    size: {
      large: {
        fontSize: '24px',
        minWidth: '2000px',
        padding: '18px 20px 12px',
      },
      medium: {
        fontSize: '18px',
        minWidth: '160px',
        padding: '13px 16px 8px',
      },
      small: {
        fontSize: '14px',
        minWidth: '120px',
        padding: '12px 16px 8px',
      },
    },
  },
});
