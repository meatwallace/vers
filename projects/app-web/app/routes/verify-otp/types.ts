import { GraphQLClient } from 'graphql-request';
import { z } from 'zod';
import { type Submission } from '@conform-to/react';
import { type VerifyOTPFormSchema } from './route.tsx';

export enum QueryParam {
  Code = 'code',
  Type = 'type',
  Target = 'target',
  RedirectTo = 'redirect',
}

export interface HandleVerificationContext {
  client: GraphQLClient;
  request: Request;
  submission: Submission<
    z.input<typeof VerifyOTPFormSchema>,
    Array<string>,
    z.output<typeof VerifyOTPFormSchema>
  >;
  transactionToken: string;
  body: FormData | URLSearchParams;
}
