import { css } from '@vers/styled-system/css';

export const container = css({
  display: 'flex',
  flexDirection: {
    base: 'column',
    md: 'row',
  },
  minHeight: 'dvh',
});

export const contentContainer = css({
  alignItems: 'center',
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  overflowY: 'auto',
});
