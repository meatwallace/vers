import * as React from 'react';
import { type OTPInputProps, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { InputOTP } from './input-otp.tsx';
import { Label } from './label.tsx';

interface Props {
  errors: Array<string>;
  inputProps: Omit<OTPInputProps, 'maxLength' | 'render'>;
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export function OTPField(props: Props) {
  const fallbackID = React.useId();
  const id = props.inputProps.id ?? fallbackID;
  const errorID = `${id}-error`;

  return (
    <div>
      <Label htmlFor={id} {...props.labelProps} />
      <InputOTP
        {...props.inputProps}
        aria-describedby={errorID}
        aria-invalid={props.errors.length > 0}
        id={id}
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      >
        <InputOTP.Group>
          <InputOTP.Slot index={0} />
          <InputOTP.Slot index={1} />
          <InputOTP.Slot index={2} />
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group>
          <InputOTP.Slot index={3} />
          <InputOTP.Slot index={4} />
          <InputOTP.Slot index={5} />
        </InputOTP.Group>
      </InputOTP>
      {props.errors.map((error) => (
        <div key={error} id={errorID}>
          {error}
        </div>
      ))}
    </div>
  );
}
