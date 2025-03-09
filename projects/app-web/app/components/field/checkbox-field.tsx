import * as React from 'react';
import * as styles from './checkbox-field.css.ts';
import { Input } from './input.tsx';
import { Label } from './label.tsx';

interface Props {
  checkboxProps: React.InputHTMLAttributes<HTMLInputElement>;
  errors: Array<string>;
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
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
        aria-describedby={errorID}
        aria-invalid={props.errors.length > 0}
        id={id}
        {...props.checkboxProps}
      />
      {props.errors.map((error) => (
        <div key={error} className={styles.error} id={errorID}>
          {error}
        </div>
      ))}
    </div>
  );
}
