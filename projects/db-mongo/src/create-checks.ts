import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { CheckFailure } from './consts';

export function createChecks() {
  const checks: Record<string, string | typeof CheckFailure> = {};

  const addCheck = (name: string, result: string | typeof CheckFailure) => {
    checks[name] = result;
  };

  const createResponse = (): [string, ContentfulStatusCode] => {
    const response = Object.entries(checks).map(([name, result]) => {
      if (result === CheckFailure) {
        return `[☓] ${name}: failed`;
      }

      return `[✓] ${name}: ${result}`;
    });

    const status = Object.values(checks).includes(CheckFailure) ? 500 : 200;

    return [response.join('\n'), status];
  };

  return { addCheck, createResponse };
}
