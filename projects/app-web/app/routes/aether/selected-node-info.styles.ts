import { css } from '@vers/styled-system/css';

export const container = css({
  backgroundColor: 'neutral.950',
  borderColor: 'gray.700',
  borderWidth: '1',
  boxShadow: 'md',
  minWidth: '96',
  rounded: 'sm',
  userSelect: 'none',
});

export const header = css({
  _before: {
    borderBottomWidth: '1',
    borderGradient: 'sky.500',
    borderRightWidth: '1',
    borderTopWidth: '1',
    bottom: 'hairline',
    content: '""',
    left: '0',
    position: 'absolute',
    right: 'hairline',
    roundedBottom: 'sm',
    top: 'hairline',
    userSelect: 'none',
    zIndex: '1',
  },
  backgroundGradient: 'to-r',
  borderGradient: 'sky.500',
  borderTopWidth: '1',
  gradientFrom: 'sky.700',
  gradientTo: 'transparent',
  gradientToPosition: '80%',
  overflow: 'hidden',
  paddingX: '4',
  paddingY: '3',
  position: 'relative',
  roundedTop: 'sm',
  zIndex: '1',
});

export const headerBackground = css({
  left: '0',
  opacity: '0.1',
  position: 'absolute',
  stroke: 'sky.100',
  top: '0',
  zIndex: '0',
});

export const content = css({
  display: 'flex',
  fontSize: 'sm',
  paddingX: '4',
  paddingY: '3',
});

export const name = css({
  color: 'sky.100',
  fontFamily: 'josefin',
  fontSize: 'lg',
  fontWeight: 'medium',
  marginBottom: '[-1px]',
});

export const difficulty = css({
  color: 'sky.200',
});

export const startButton = css({
  marginLeft: 'auto',
});
