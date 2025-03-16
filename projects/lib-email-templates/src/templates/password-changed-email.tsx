import * as E from '@react-email/components';

interface Props {
  email: string;
}

export function PasswordChangedEmail({ email }: Props) {
  return (
    <E.Container>
      <E.Heading>Password Changed</E.Heading>
      <E.Text>Hi there,</E.Text>
      <E.Text>
        The password for your account ({email}) was just changed. If you made
        this change, you can safely ignore this email.
      </E.Text>
      <E.Text>
        If you did not change your password, please contact support immediately.
      </E.Text>
      <E.Hr />
      <E.Text>Best regards,</E.Text>
      <E.Text>The Team</E.Text>
    </E.Container>
  );
}
