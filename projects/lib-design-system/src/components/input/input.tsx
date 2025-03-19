import * as React from 'react';
import { Input as BaseInput } from '@base-ui-components/react/input';
import { css } from '@vers/styled-system/css';
import { cx } from '@vers/styled-system/css';

export type Props = React.ComponentProps<typeof BaseInput> & {
  className?: string;
};

const input = css({
  _focusVisible: {
    borderColor: 'neutral.400',
    outline: 'none',
  },
  _invalid: {
    borderColor: 'red.500',
  },
  _placeholder: {
    color: 'neutral.600',
  },
  backgroundColor: 'neutral.800',
  borderColor: 'neutral.700',
  borderRadius: 'md',
  borderWidth: '1',
  color: 'neutral.300',
  outline: 'none',
  paddingX: '3',
  paddingY: '2',
  width: 'full',
});

export function Input(props: Props) {
  const { className, ...restProps } = props;

  return <BaseInput {...restProps} className={cx(input, className)} />;
}
