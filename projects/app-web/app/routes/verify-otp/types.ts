import { type Submission } from '@conform-to/react';
import { GraphQLClient } from 'graphql-request';
import { z } from 'zod';
import { type VerifyOTPFormSchema } from './route.tsx';

export enum QueryParam {
  Code = 'code',
  RedirectTo = 'redirect',
  Target = 'target',
  Type = 'type',
}

export interface HandleVerificationContext {
  body: FormData | URLSearchParams;
  client: GraphQLClient;
  request: Request;
  submission: Submission<
    z.input<typeof VerifyOTPFormSchema>,
    Array<string>,
    z.output<typeof VerifyOTPFormSchema>
  >;
  transactionToken: string;
}
