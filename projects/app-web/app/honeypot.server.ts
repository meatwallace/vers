import { Honeypot } from 'remix-utils/honeypot/server';

export const honeypot = new Honeypot({
  validFromFieldName: process.env.NODE_ENV === 'test' ? null : undefined,
  encryptionSeed: process.env.HONEYPOT_SECRET,
});
