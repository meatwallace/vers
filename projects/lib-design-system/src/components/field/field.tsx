import * as React from 'react';
import { Field as BaseField } from '@base-ui-components/react/field';
import { css, cx } from '@vers/styled-system/css';
import { stack } from '@vers/styled-system/patterns';
import { Input } from '../input/input';

interface Props {
  errors: Array<string>;
  inputProps: React.ComponentProps<typeof Input>;
  labelProps: React.ComponentProps<typeof BaseField.Label> & {
    className?: string;
  };
}

const container = stack({
  gap: '2',
  marginBottom: '3',
  maxWidth: '96',
});

const label = css({
  color: 'slate.200',
  fontFamily: 'karla',
  fontSize: 'sm',
  fontWeight: 'semibold',
  lineHeight: 'normal',
});

const errorStyle = css({
  color: 'red.500',
  fontSize: 'sm',
});

export function Field(props: Props) {
  const fallbackID = React.useId();
  const id = props.inputProps.id ?? fallbackID;
  const errorID = `${id}-error`;
  const [firstError] = props.errors;

  return (
    <BaseField.Root className={container} id={id}>
      <BaseField.Label
        {...props.labelProps}
        className={cx(label, props.labelProps.className)}
      />
      <Input
        {...props.inputProps}
        key={props.inputProps.key}
        aria-describedby={errorID}
        aria-invalid={props.errors.length > 0}
        id={id}
      />
      <BaseField.Error className={errorStyle} id={errorID} forceShow>
        {firstError}
      </BaseField.Error>
    </BaseField.Root>
  );
}
