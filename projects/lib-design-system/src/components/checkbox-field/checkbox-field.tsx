import * as React from 'react';
import { Field } from '@base-ui-components/react/field';
import { css, cx } from '@vers/styled-system/css';
import { Checkbox } from '../checkbox/checkbox';

interface Props {
  checkboxProps: React.ComponentProps<typeof Checkbox>;
  errors: Array<string>;
  labelProps: React.ComponentProps<typeof Field.Label> & {
    className?: string;
  };
}

const container = css({
  alignItems: 'flex-start',
  display: 'flex',
  flexFlow: 'column',
  gap: '2',
  marginBottom: '3',
  maxWidth: '96',
});

const field = css({
  alignItems: 'center',
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: '3',
});

const label = css({
  color: 'slate.200',
  fontFamily: 'karla',
  fontSize: 'md',
  fontWeight: 'normal',
  lineHeight: 'normal',
});

const errorStyle = css({
  color: 'red.500',
  fontSize: 'sm',
});

export function CheckboxField(props: Props) {
  const fallbackID = React.useId();
  const id = props.checkboxProps.id ?? fallbackID;
  const errorID = `${id}-error`;
  const [firstError] = props.errors;

  return (
    <Field.Root className={container}>
      <div className={field}>
        <Checkbox
          aria-describedby={errorID}
          aria-invalid={props.errors.length > 0}
          id={id}
          {...props.checkboxProps}
        />
        <Field.Label
          {...props.labelProps}
          className={cx(label, props.labelProps.className)}
        />
      </div>
      <Field.Error className={errorStyle} id={errorID} forceShow>
        {firstError}
      </Field.Error>
    </Field.Root>
  );
}
