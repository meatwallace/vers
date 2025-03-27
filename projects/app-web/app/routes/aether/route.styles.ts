import { css } from '@vers/styled-system/css';

export const container = css({
  height: {
    base: '[calc(100dvh - 56px)]',
    md: 'dvh',
  },
  position: 'relative',
  width: 'full',
});

export const tooltip = css({
  left: '0',
  position: 'fixed',
  top: '0',
});

export const selectedNodeInfo = css({
  bottom: '8',
  position: 'absolute',
  right: '8',
});
