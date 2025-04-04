import * as React from 'react';
import { Input as BaseInput } from '@base-ui-components/react/input';
import { css } from '@vers/styled-system/css';
import { cx } from '@vers/styled-system/css';

export type Props = React.ComponentProps<typeof BaseInput> & {
  className?: string;
};

const input = css({
  _focusVisible: {
    borderColor: 'gray.500',
    outline: 'none',
  },
  _invalid: {
    borderColor: 'red.500',
  },
  _placeholder: {
    color: 'gray.600',
  },
  backgroundColor: 'gray.900',
  borderColor: 'gray.700',
  borderWidth: '1',
  color: 'gray.300',
  outline: 'none',
  paddingX: '3',
  paddingY: '2',
  rounded: 'md',
  width: 'full',
});

export function Input(props: Props) {
  const { className, ...restProps } = props;

  return <BaseInput {...restProps} className={cx(input, className)} />;
}
