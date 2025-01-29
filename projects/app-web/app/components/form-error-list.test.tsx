import { render, screen } from '@testing-library/react';
import { FormErrorList } from './form-error-list';

test('it renders nothing when there are no errors', () => {
  const { container } = render(<FormErrorList id="test-errors" errors={[]} />);

  expect(container).toBeEmptyDOMElement();
});

test('it displays error messages', () => {
  const errors = ['Error 1', 'Error 2'];

  render(<FormErrorList id="test-errors" errors={errors} />);

  expect(screen.getByText('Error 1')).toBeInTheDocument();
  expect(screen.getByText('Error 2')).toBeInTheDocument();
});
