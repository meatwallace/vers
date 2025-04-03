import { css } from '@vers/styled-system/css';

export const container = css({
  alignItems: 'center',
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  paddingTop: '8',
  width: {
    '2xl': '9/12',
    base: '11/12',
    lg: '11/12',
    md: '11/12',
    sm: '11/12',
    xl: '11/12',
  },
});

export const formStyles = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '6',
});

export const nameField = css({
  width: 'full',
});
