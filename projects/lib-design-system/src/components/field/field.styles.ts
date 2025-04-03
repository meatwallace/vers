import { css } from '@vers/styled-system/css';
import { stack } from '@vers/styled-system/patterns';

export const container = stack({
  gap: '2',
  marginBottom: '3',
  maxWidth: '96',
});

export const label = css({
  color: 'slate.200',
  fontFamily: 'karla',
  fontSize: 'sm',
  fontWeight: 'semibold',
  lineHeight: 'normal',
});

export const errorStyle = css({
  color: 'red.500',
  fontSize: 'sm',
});
