import * as React from 'react';
import { Field } from '@base-ui-components/react/field';
import { css, cx } from '@vers/styled-system/css';
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { InputOTP } from './input-otp';

interface Props {
  className?: string;
  errors: Array<string>;
  inputProps: React.ComponentProps<typeof Field.Control> & {
    mode?: 'alphanumeric' | 'numeric';
  };
}

const container = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  justifyContent: 'center',
  marginBottom: '4',
});

const errorStyle = css({
  color: 'red.500',
  fontSize: 'sm',
});

export function OTPField(props: Props) {
  const fallbackID = React.useId();
  const id = props.inputProps.id ?? fallbackID;
  const errorID = `${id}-error`;
  const [firstError] = props.errors;

  return (
    <Field.Root className={cx(container, props.className)}>
      <Field.Control
        {...props.inputProps}
        aria-describedby={errorID}
        aria-invalid={props.errors.length > 0}
        id={id}
        render={(controlProps: React.ComponentProps<'input'>) => {
          // a hacky interop around the input-otp library to make it work with
          // base-ui's Field component.
          const onChange = (newValue: string) => {
            const event = {
              currentTarget: { value: newValue },
              nativeEvent: { defaultPrevented: false },
            } as React.ChangeEvent<HTMLInputElement>;

            controlProps.onChange?.(event);
          };

          const pattern =
            props.inputProps.mode === 'alphanumeric'
              ? REGEXP_ONLY_DIGITS_AND_CHARS
              : REGEXP_ONLY_DIGITS;

          const inputMode =
            props.inputProps.mode === 'alphanumeric' ? 'text' : 'numeric';

          return (
            <InputOTP
              {...controlProps}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              data-testid="otp-input"
              inputMode={inputMode}
              maxLength={6}
              pattern={pattern}
              spellCheck={false}
              value={controlProps.value as string}
              onChange={onChange}
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
          );
        }}
      />
      <Field.Error className={errorStyle} id={errorID} forceShow>
        {firstError}
      </Field.Error>
    </Field.Root>
  );
}
