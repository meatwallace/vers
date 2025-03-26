import { css } from '@vers/styled-system/css';

export const profileSection = css({
  alignSelf: 'flex-start',
  borderBottomWidth: '1',
  borderColor: 'neutral.800',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '3',
  paddingBottom: '3',
  width: 'full',
});

export const profileInfoRow = css({
  marginBottom: '2',
});

export const profileInfoLabel = css({
  color: 'neutral.500',
  fontWeight: 'bold',
  marginBottom: '1',
});

export const profileInfoValue = css({
  marginBottom: '1',
});

export const twoFactorDescription = css({
  color: 'neutral.500',
  marginBottom: '4',
});
