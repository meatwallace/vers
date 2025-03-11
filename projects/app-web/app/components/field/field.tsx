import * as React from 'react';
import { Input } from './input';
import { Label } from './label';

interface Props {
  errors: Array<string>;
  inputProps: React.InputHTMLAttributes<HTMLInputElement> & { key?: string };
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement> & { key?: string };
}

export function Field(props: Props) {
  const fallbackID = React.useId();
  const id = props.inputProps.id ?? fallbackID;
  const errorID = `${id}-error`;

  return (
    <div>
      <Label htmlFor={id} {...props.labelProps} />
      <Input
        {...props.inputProps}
        key={props.inputProps.key}
        aria-describedby={errorID}
        aria-invalid={props.errors.length > 0}
        id={id}
      />
      {props.errors.map((error) => (
        <div key={error} id={errorID}>
          {error}
        </div>
      ))}
    </div>
  );
}
