import { Outlet } from 'react-router';
import { css } from '@vers/styled-system/css';

const container = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: '96',
  paddingTop: '8',
  width: '2/3',
});

export function PublicLayout() {
  return (
    <main className={container}>
      <Outlet />
    </main>
  );
}

export default PublicLayout;
