import * as React from 'react';
import * as styles from './checkbox-field.css.ts';
import { Label } from './label.tsx';
import { Input } from './input.tsx';

interface Props {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  checkboxProps: React.InputHTMLAttributes<HTMLInputElement>;
  errors: Array<string>;
}

// TODO(#31): rework to a custom styled checkbox component
export function CheckboxField(props: Props) {
  const fallbackID = React.useId();
  const id = props.checkboxProps.id ?? fallbackID;
  const errorID = `${id}-error`;

  return (
    <div className={styles.container}>
      <Label htmlFor={id} {...props.labelProps} />
      <Input
        id={id}
        aria-invalid={props.errors.length > 0}
        aria-describedby={errorID}
        {...props.checkboxProps}
      />
      {props.errors.map((error) => (
        <div key={error} id={errorID} className={styles.error}>
          {error}
        </div>
      ))}
    </div>
  );
}
