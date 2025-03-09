import { useSpinDelay } from 'spin-delay';
import { Button, type Props as ButtonProps } from './button.tsx';
import { Icon } from './icon.tsx';
import { Spinner } from './spinner.tsx';

type Props = ButtonProps & {
  spinDelay?: number;
  status: StatusButtonStatus;
};

enum StatusButtonStatus {
  Error = 'error',
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
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
      <Icon.Checkmark aria-hidden="false" aria-label="Success" role="img" />
    );
  }

  if (status === StatusButtonStatus.Error) {
    return <Icon.Cross aria-hidden="false" aria-label="Error" role="img" />;
  }

  return null;
}
