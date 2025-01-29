import * as React from 'react';
import clsx from 'clsx';
import { OTPInput, OTPInputContext } from 'input-otp';
import invariant from 'tiny-invariant';
import * as styles from './input-otp.css.ts';

type Props = React.ComponentPropsWithoutRef<typeof OTPInput>;

export function InputOTP(props: Props) {
  const { className, containerClassName, ...restProps } = props;

  return (
    <OTPInput
      {...restProps}
      containerClassName={clsx(styles.container, containerClassName)}
      className={clsx(styles.input, className)}
    />
  );
}

function InputOTPGroup(props: React.ComponentProps<'div'>) {
  return <div {...props} className={clsx(styles.group, props.className)} />;
}

InputOTP.Group = InputOTPGroup;

function InputOTPSeparator(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      role="separator"
      className={clsx(styles.separator, props.className)}
    />
  );
}

InputOTP.Separator = InputOTPSeparator;

function InputOTPSlot(props: React.ComponentProps<'div'> & { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const slot = inputOTPContext.slots[props.index];

  invariant(slot, 'invalid slot index');

  return (
    <div
      className={clsx(
        styles.slot,
        slot.isActive && styles.activeSlot,
        props.className,
      )}
      {...props}
    >
      {slot.char}
      {slot.hasFakeCaret && (
        <div className={styles.caret}>
          <div className={styles.caretBlink} />
        </div>
      )}
    </div>
  );
}

InputOTP.Slot = InputOTPSlot;
