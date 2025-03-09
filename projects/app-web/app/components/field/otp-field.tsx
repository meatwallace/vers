import * as React from 'react';
import { REGEXP_ONLY_DIGITS_AND_CHARS, type OTPInputProps } from 'input-otp';
import { Label } from './label.tsx';
import { InputOTP } from './input-otp.tsx';
import * as styles from './otp-field.css.ts';

interface Props {
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: Omit<OTPInputProps, 'maxLength' | 'render'>;
  errors: Array<string>;
}

export function OTPField(props: Props) {
  const fallbackID = React.useId();
  const id = props.inputProps.id ?? fallbackID;
  const errorID = `${id}-error`;

  return (
    <div className={styles.container}>
      <Label htmlFor={id} {...props.labelProps} />
      <InputOTP
        {...props.inputProps}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        maxLength={6}
        id={id}
        aria-invalid={props.errors.length > 0}
        aria-describedby={errorID}
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
        <div key={error} id={errorID} className={styles.error}>
          {error}
        </div>
      ))}
    </div>
  );
}
