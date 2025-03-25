import { Link as RRLink } from 'react-router';
import { Brand, Link } from '@vers/design-system';
import { css } from '@vers/styled-system/css';
import { Routes } from '~/types.ts';

interface Props {
  user: {
    name?: string;
    username: string;
  };
}

const header = css({
  backgroundColor: 'neutral.950',
  display: 'flex',
  height: '14',
});

const leftContainer = css({
  display: 'flex',
  flexBasis: '0',
  flexGrow: '0.3',
  marginLeft: '8',
});

const centerContainer = css({
  alignItems: 'center',
  display: 'flex',
  flexGrow: '1',
  justifyContent: 'center',
});

const rightContainer = css({
  alignItems: 'center',
  display: 'flex',
  flexBasis: '0',
  flexGrow: '0.3',
  justifyContent: 'flex-end',
  marginRight: '8',
});

const brand = css({
  fontSize: 'md',
});

export function Header(props: Props) {
  return (
    <>
      <header className={header}>
        <section className={leftContainer}>{/* menu here */}</section>

        <section className={centerContainer}>
          <RRLink to={Routes.Dashboard}>
            <Brand className={brand} size="lg" />
          </RRLink>
        </section>

        <section className={rightContainer}>
          <Link to={Routes.Profile}>{props.user.username}</Link>
        </section>
      </header>
    </>
  );
}
