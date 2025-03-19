import { Checkbox as BaseCheckbox } from '@base-ui-components/react/checkbox';
import { css, cx } from '@vers/styled-system/css';
import { Icon } from '../icon/icon';

export type Props = Omit<
  React.ComponentProps<typeof BaseCheckbox.Root>,
  'type'
> & {
  className?: string;
};

const checkbox = css({
  _checked: {
    backgroundColor: 'neutral.200',
  },
  _focusVisible: {
    outline: 'none',
    outlineOffset: '2',
  },
  _unchecked: {
    borderColor: 'neutral.200',
    borderWidth: '1',
  },
  alignItems: 'center',
  display: 'flex',
  height: '5',
  justifyContent: 'center',
  outline: 'none',
  rounded: 'sm',
  width: '5',
});

const indicator = css({
  _unchecked: {
    display: 'none',
  },
  display: 'flex',
});

const icon = css({
  color: 'neutral.900',
});

export function Checkbox(props: Props) {
  return (
    <BaseCheckbox.Root
      {...props}
      className={cx(checkbox, props.className)}
      type="button"
    >
      <BaseCheckbox.Indicator className={indicator}>
        <Icon.Checkmark className={icon} size={16} />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
