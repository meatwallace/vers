import * as React from 'react';
import { Field as BaseField } from '@base-ui-components/react/field';
import { cx } from '@vers/styled-system/css';
import { Input } from '../input/input';
import * as styles from './field.styles';

interface Props {
  className?: string;
  errors: Array<string>;
  inputProps: React.ComponentProps<typeof Input>;
  labelProps: React.ComponentProps<typeof BaseField.Label> & {
    className?: string;
  };
}

export function Field(props: Props) {
  const fallbackID = React.useId();
  const id = props.inputProps.id ?? fallbackID;
  const errorID = `${id}-error`;
  const [firstError] = props.errors;

  return (
    <BaseField.Root className={cx(styles.container, props.className)} id={id}>
      <BaseField.Label
        {...props.labelProps}
        className={cx(styles.label, props.labelProps.className)}
      />
      <Input
        {...props.inputProps}
        key={props.inputProps.key}
        aria-describedby={errorID}
        aria-invalid={props.errors.length > 0}
        id={id}
      />
      <BaseField.Error className={styles.errorStyle} id={errorID} forceShow>
        {firstError}
      </BaseField.Error>
    </BaseField.Root>
  );
}
