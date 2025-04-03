import { css } from '@vers/styled-system/css';

export const container = css({
  textAlign: 'center',
});

export const tagline = css({
  fontSize: 'lg',
  fontWeight: 'bold',
  marginBottom: '4',
});

export const link = css({
  _hover: {
    color: 'sky.200',
  },
  fontSize: 'lg',
  fontWeight: 'bold',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingX: '2',
  paddingY: '2',
  rounded: 'md',
  textAlign: 'center',
  transition: 'colors',
  transitionDuration: 'fastest',
  transitionTimingFunction: 'in',
});
