import { style } from '@vanilla-extract/css';

export const container = style({
  maxWidth: '800px',
  margin: '0 auto',
  padding: '1rem',
});

export const section = style({
  marginTop: '1.5rem',
  padding: '1.5rem',
  backgroundColor: '#f8f9fa',
  borderRadius: '0.375rem',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
});

export const instructions = style({
  marginTop: '1rem',
  marginBottom: '1.5rem',
});

export const qrCodeContainer = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1.5rem',
  marginBottom: '1.5rem',
});

export const qrCode = style({
  width: '200px',
  height: '200px',
  border: '1px solid #e5e7eb',
  borderRadius: '0.375rem',
  padding: '0.5rem',
});

export const manualCode = style({
  marginTop: '1.5rem',
  marginBottom: '1.5rem',
  padding: '1rem',
  backgroundColor: '#f3f4f6',
  borderRadius: '0.375rem',
});

export const code = style({
  display: 'block',
  marginTop: '0.5rem',
  padding: '0.75rem',
  backgroundColor: '#e5e7eb',
  borderRadius: '0.25rem',
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  overflowWrap: 'break-word',
});

export const form = style({
  marginTop: '1.5rem',
});

export const formGroup = style({
  marginBottom: '1.5rem',
});

export const actions = style({
  display: 'flex',
  justifyContent: 'flex-end',
});
