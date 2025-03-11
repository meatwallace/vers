import * as React from 'react';

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export function Button(props: Props) {
  const { className, ...restProps } = props;

  return <button {...restProps} className={className} />;
}
