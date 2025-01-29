import * as E from '@react-email/components';

type Props = {
  onboardingURL: string;
  otp: string;
};

export function WelcomeEmail(props: Props) {
  return (
    <E.Container>
      <E.Heading as="h1">
        <E.Text>Welcome to Chrononomicon.</E.Text>
      </E.Heading>
      <E.Text>
        Here's your verification code: <strong>{props.otp}</strong>
      </E.Text>
      <E.Text>Or click the link to get started:</E.Text>
      <E.Link href={props.onboardingURL}>{props.onboardingURL}</E.Link>
    </E.Container>
  );
}
