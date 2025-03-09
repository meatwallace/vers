import { Honeypot } from 'remix-utils/honeypot/server';

export const honeypot = new Honeypot({
  encryptionSeed: process.env.HONEYPOT_SECRET,
  validFromFieldName: process.env.NODE_ENV === 'test' ? null : undefined,
});
