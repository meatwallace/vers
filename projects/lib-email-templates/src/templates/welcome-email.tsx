import * as E from '@react-email/components';

interface Props {
  verificationCode: string;
  verificationURL: string;
}

export function WelcomeEmail(props: Props) {
  return (
    <E.Container>
      <E.Heading as="h1">
        <E.Text>Welcome to vers.</E.Text>
      </E.Heading>
      <E.Text>
        Here&apos;s your verification code:{' '}
        <strong>{props.verificationCode}</strong>
      </E.Text>
      <E.Text>Or click the link to get started:</E.Text>
      <E.Link href={props.verificationURL}>{props.verificationURL}</E.Link>
    </E.Container>
  );
}
