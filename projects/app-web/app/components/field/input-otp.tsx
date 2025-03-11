import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import invariant from 'tiny-invariant';

type Props = React.ComponentPropsWithoutRef<typeof OTPInput>;

export function InputOTP(props: Props) {
  const { className, containerClassName, ...restProps } = props;

  return (
    <OTPInput
      {...restProps}
      className={className}
      containerClassName={containerClassName}
    />
  );
}

function InputOTPGroup(props: React.ComponentProps<'div'>) {
  return <div {...props} className={props.className} />;
}

InputOTP.Group = InputOTPGroup;

function InputOTPSeparator(props: React.ComponentProps<'div'>) {
  return <div {...props} className={props.className} role="separator" />;
}

InputOTP.Separator = InputOTPSeparator;

function InputOTPSlot(props: React.ComponentProps<'div'> & { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const slot = inputOTPContext.slots[props.index];

  invariant(slot, 'invalid slot index');

  return (
    <div className={props.className} {...props}>
      {slot.char}
      {slot.hasFakeCaret && (
        <div>
          <div />
        </div>
      )}
    </div>
  );
}

InputOTP.Slot = InputOTPSlot;
