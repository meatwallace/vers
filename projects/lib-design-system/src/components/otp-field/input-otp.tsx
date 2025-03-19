import * as React from 'react';
import { css, cx } from '@vers/styled-system/css';
import { stack } from '@vers/styled-system/patterns';
import { OTPInput, OTPInputContext } from 'input-otp';
import invariant from 'tiny-invariant';

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
  backgroundColor: 'neutral.800',
  height: '1',
  rounded: 'sm',
  width: '1',
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
  backgroundColor: 'neutral.800',
  borderColor: 'neutral.800',
  borderWidth: '1',
  color: 'neutral.300',
  display: 'flex',
  fontSize: 'md',
  height: '11',
  justifyContent: 'center',
  lineHeight: 'normal',
  position: 'relative',
  rounded: 'sm',
  textTransform: 'uppercase',
  width: '9',
});

const activeSlot = css({
  borderColor: 'neutral.600',
  zIndex: 10,
});

const caret = css({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',
  position: 'absolute',
});

const caretBlink = css({
  animationDuration: '[1.2s]',
  animationIterationCount: 'infinite',
  animationName: 'caret-blink',
  animationTimingFunction: 'in-out',
  backgroundColor: 'neutral.500',
  height: '4',
  width: '[1px]',
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
