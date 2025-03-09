import { Jsonify } from 'type-fest';
import { VerificationData } from './types';

export function marshal(raw: Jsonify<VerificationData>): VerificationData {
  return {
    id: raw.id,
    target: raw.target,
    type: raw.type,
  };
}
