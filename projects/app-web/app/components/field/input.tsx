import * as React from 'react';

type Props = React.ComponentProps<'input'>;

export function Input(props: Props) {
  const { className, ...restProps } = props;

  return <input {...restProps} className={className} />;
}
