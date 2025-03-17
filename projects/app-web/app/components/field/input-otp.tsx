import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import invariant from 'tiny-invariant';
import { css, cx } from '../../styled-system/css';
import { stack } from '../../styled-system/patterns';

type Props = React.ComponentPropsWithoutRef<typeof OTPInput>;

const container = stack({
  _disabled: {
    opacity: 0.5,
  },
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  gap: '2',
});

const input = css({
  _disabled: {
    cursor: 'not-allowed',
  },
});

export function InputOTP(props: Props) {
  const { className, containerClassName, ...restProps } = props;

  return (
    <OTPInput
      {...restProps}
      className={cx(input, className)}
      containerClassName={cx(container, containerClassName)}
    />
  );
}

const group = stack({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  gap: '2',
});

function InputOTPGroup(props: React.ComponentProps<'div'>) {
  return <div {...props} className={cx(group, props.className)} />;
}

InputOTP.Group = InputOTPGroup;

const separator = css({
  border: 'none',
  height: '1px',
  width: '1px',
});

function InputOTPSeparator(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cx(separator, props.className)}
      role="separator"
    />
  );
}

InputOTP.Separator = InputOTPSeparator;

const slot = css({
  alignItems: 'center',
  border: '1px solid #000',
  borderRadius: '4px',
  display: 'flex',
  fontSize: '24px',
  height: '64px',
  justifyContent: 'center',
  lineHeight: '24px',
  position: 'relative',
  width: '48px',
});

const activeSlot = css({
  borderColor: 'blue',
  boxShadow: '0 0 0 2px blue',
  zIndex: 10,
});

const caret = css({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  // pointerEvents: 'none',
  position: 'absolute',
});

const caretBlink = css({
  animation: 'pulse 1.2s ease-out infinite',
  height: '16px',
  width: '1px',
});

function InputOTPSlot(props: React.ComponentProps<'div'> & { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const slotData = inputOTPContext.slots[props.index];

  invariant(slotData, 'invalid slot index');

  return (
    <div
      className={cx(slotData.isActive && activeSlot, slot, props.className)}
      {...props}
    >
      {slotData.char}
      {slotData.hasFakeCaret && (
        <div className={caret}>
          <div className={caretBlink} />
        </div>
      )}
    </div>
  );
}

InputOTP.Slot = InputOTPSlot;
