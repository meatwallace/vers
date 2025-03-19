import { MemoryRouter } from 'react-router';
import { Link } from './link';

export const Default = () => {
  return (
    <MemoryRouter>
      <Link to="/">Take me somewhere</Link>
    </MemoryRouter>
  );
};
