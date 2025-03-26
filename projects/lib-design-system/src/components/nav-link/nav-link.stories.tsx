import { MemoryRouter } from 'react-router';
import { NavLink } from './nav-link';

export const Default = () => {
  return (
    <MemoryRouter>
      <NavLink to="/">Take me somewhere</NavLink>
    </MemoryRouter>
  );
};
