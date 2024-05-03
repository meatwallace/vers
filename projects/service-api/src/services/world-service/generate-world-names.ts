import { ServiceResponse } from '../types';
import { GenerateWorldNamesArgs, WorldServiceContext } from './types';

type GenerateWorldNamesResponse = ServiceResponse<Array<string>>;

export async function generateWorldNames(
  args: GenerateWorldNamesArgs,
  ctx: WorldServiceContext,
): Promise<Array<string>> {
  const response = await ctx.client.post<GenerateWorldNamesResponse>(
    'generate-world-names',
    {
      body: JSON.stringify(args),
      resolveBodyOnly: true,
    },
  );

  if (!response.success) {
    // TODO(#16): capture via Sentry
    throw new Error('An unknown error occurred');
  }

  return response.data;
}
