import { style } from '@vanilla-extract/css';

export const card = style({
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  maxWidth: '32rem',
  width: '100%',
});

export const header = style({
  borderBottom: '1px solid #e5e7eb',
  padding: '1.5rem',
});

export const title = style({
  color: '#111827',
  fontSize: '1.25rem',
  fontWeight: '600',
  lineHeight: '1.75rem',
  margin: 0,
});

export const body = style({
  padding: '1.5rem',
});
