import { css } from '@vers/styled-system/css';

interface Props {
  errors: Array<null | string | undefined>;
  id?: string;
}

const errorList = css({
  marginBottom: '2',
});

const errorItem = css({
  color: 'red.500',
  fontSize: 'sm',
});

export function FormErrorList(props: Props) {
  const errors = props.errors.filter(Boolean);

  if (errors.length === 0) {
    return null;
  }

  return (
    <ul {...props} className={errorList}>
      {errors.map((error) => (
        <li key={error} className={errorItem}>
          {error}
        </li>
      ))}
    </ul>
  );
}
