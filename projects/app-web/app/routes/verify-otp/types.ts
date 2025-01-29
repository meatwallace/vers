import { GraphQLClient } from 'graphql-request';
import { z } from 'zod';
import { type Submission } from '@conform-to/react';
import { type VerifyOTPFormSchema } from './verify-otp.tsx';

export type HandleVerificationContext = {
  client: GraphQLClient;
  request: Request;
  submission: Submission<
    z.input<typeof VerifyOTPFormSchema>,
    string[],
    z.output<typeof VerifyOTPFormSchema>
  >;
  body: FormData | URLSearchParams;
};
