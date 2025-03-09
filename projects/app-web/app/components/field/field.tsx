import * as React from 'react';
import * as styles from './field.css.ts';
import { Label } from './label';
import { Input } from './input';

interface Props {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement> & { key?: string };
  inputProps: React.InputHTMLAttributes<HTMLInputElement> & { key?: string };
  errors: Array<string>;
}

export function Field(props: Props) {
  const fallbackID = React.useId();
  const id = props.inputProps.id ?? fallbackID;
  const errorID = `${id}-error`;

  return (
    <div className={styles.container}>
      <Label htmlFor={id} {...props.labelProps} />
      <Input
        {...props.inputProps}
        id={id}
        key={props.inputProps.key}
        aria-invalid={props.errors.length > 0}
        aria-describedby={errorID}
      />
      {props.errors.map((error) => (
        <div key={error} id={errorID} className={styles.error}>
          {error}
        </div>
      ))}
    </div>
  );
}
