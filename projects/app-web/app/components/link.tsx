import * as React from 'react';
import { Link as RouterLink } from 'react-router';

type Props = React.ComponentProps<typeof RouterLink>;

export function Link({ className, ...props }: Props) {
  return <RouterLink {...props} className={className} />;
}
