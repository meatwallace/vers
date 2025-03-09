import { style } from '@vanilla-extract/css';

export const container = style({
  margin: '0 auto',
  maxWidth: '800px',
  padding: '1rem',
});

export const section = style({
  backgroundColor: '#f8f9fa',
  borderRadius: '0.375rem',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  marginTop: '1.5rem',
  padding: '1.5rem',
});

export const instructions = style({
  marginBottom: '1.5rem',
  marginTop: '1rem',
});

export const qrCodeContainer = style({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '1.5rem',
  marginTop: '1.5rem',
});

export const qrCode = style({
  border: '1px solid #e5e7eb',
  borderRadius: '0.375rem',
  height: '200px',
  padding: '0.5rem',
  width: '200px',
});

export const manualCode = style({
  backgroundColor: '#f3f4f6',
  borderRadius: '0.375rem',
  marginBottom: '1.5rem',
  marginTop: '1.5rem',
  padding: '1rem',
});

export const code = style({
  backgroundColor: '#e5e7eb',
  borderRadius: '0.25rem',
  display: 'block',
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  marginTop: '0.5rem',
  overflowWrap: 'break-word',
  padding: '0.75rem',
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
