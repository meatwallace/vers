import { css } from '@vers/styled-system/css';

export const header = css({
  backgroundColor: 'gray.950',
  display: {
    base: 'flex',
    md: 'none',
  },
  height: '14',
  zIndex: '[10]',
});

export const leftContainer = css({
  display: 'flex',
  flexBasis: '0',
  flexGrow: '0.3',
  marginLeft: '8',
});

export const centerContainer = css({
  alignItems: 'center',
  display: 'flex',
  flexGrow: '1',
  justifyContent: 'center',
});

export const rightContainer = css({
  alignItems: 'center',
  display: 'flex',
  flexBasis: '0',
  flexGrow: '0.3',
  justifyContent: 'flex-end',
  marginRight: '8',
});

export const brand = css({
  fontSize: 'md',
});
