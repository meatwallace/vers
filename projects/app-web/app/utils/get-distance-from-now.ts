import { formatDistance } from 'date-fns';

export function getDistanceFromNow(date: Date): string {
  const formatOpts = { includeSeconds: true, addSuffix: true };

  return formatDistance(new Date(date), new Date(), formatOpts);
}
