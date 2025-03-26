import { css } from '@vers/styled-system/css';

export const container = css({
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  paddingTop: '8',
  width: {
    '2xl': '1/2',
    base: '4/5',
    lg: '2/3',
    md: '10/12',
    sm: '11/12',
    xl: '1/2',
  },
});
