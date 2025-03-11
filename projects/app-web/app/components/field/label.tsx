import * as React from 'react';

type Props = React.ComponentProps<'label'>;

export function Label({ className, htmlFor, ...restProps }: Props) {
  return <label {...restProps} className={className} htmlFor={htmlFor} />;
}
