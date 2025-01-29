import { useSpinDelay } from 'spin-delay';
import { Button, type Props as ButtonProps } from './button.tsx';
import { Icon } from './icon.tsx';
import { Spinner } from './spinner.tsx';

type Props = ButtonProps & {
  status: StatusButtonStatus;
  spinDelay?: number;
};

enum StatusButtonStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

export function StatusButton(props: Props) {
  const { children, ...restProps } = props;

  const isPending = restProps.status === StatusButtonStatus.Pending;

  const isPendingVisible = useSpinDelay(isPending, {
    delay: 400,
    minDuration: 300,
  });

  const statusIcon = getStatusIcon(restProps.status, isPendingVisible);

  return (
    <Button {...restProps}>
      {children}
      {statusIcon}
    </Button>
  );
}

StatusButton.Status = StatusButtonStatus;

function getStatusIcon(status: StatusButtonStatus, isPendingVisible: boolean) {
  if (status === StatusButtonStatus.Pending && isPendingVisible) {
    return <Spinner />;
  }

  if (status === StatusButtonStatus.Success) {
    return (
      <Icon.Checkmark role="img" aria-label="Success" aria-hidden="false" />
    );
  }

  if (status === StatusButtonStatus.Error) {
    return <Icon.Cross role="img" aria-label="Error" aria-hidden="false" />;
  }

  return null;
}
