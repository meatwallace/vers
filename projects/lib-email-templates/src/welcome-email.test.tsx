import { render, screen } from '@testing-library/react';
import { WelcomeEmail } from './welcome-email';

test('it renders a welcome email with provided configuration', async () => {
  const props = {
    onboardingURL: 'https://chrononomicon.com/onboarding?token=123456',
    otp: '123456',
  };

  render(<WelcomeEmail {...props} />);

  const welcomeMessage = screen.getByText('Welcome to Chrononomicon.');
  const verificationCode = screen.getByText(props.otp);
  const onboardingLink = screen.getByText(props.onboardingURL);

  expect(welcomeMessage).toBeInTheDocument();
  expect(verificationCode).toBeInTheDocument();
  expect(onboardingLink).toBeInTheDocument();
});
