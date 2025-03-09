import { render, screen } from '@testing-library/react';
import { WelcomeEmail } from './welcome-email';

test('it renders a welcome email with provided configuration', () => {
  const props = {
    verificationCode: '123456',
    verificationURL: 'https://chrononomicon.com/verification?token=123456',
  };

  render(<WelcomeEmail {...props} />);

  const welcomeMessage = screen.getByText('Welcome to Chrononomicon.');
  const verificationCode = screen.getByText('123456');
  const verificationLink = screen.getByText(
    'https://chrononomicon.com/verification?token=123456',
  );

  expect(welcomeMessage).toBeInTheDocument();
  expect(verificationCode).toBeInTheDocument();
  expect(verificationLink).toBeInTheDocument();
});
