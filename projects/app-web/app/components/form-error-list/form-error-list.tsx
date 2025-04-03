import * as styles from './form-error-list.styles.ts';

interface Props {
  errors?: Array<null | string | undefined> | null;
  id?: string;
}

export function FormErrorList(props: Props) {
  const errors = props.errors?.filter(Boolean) ?? [];

  if (errors.length === 0) {
    return null;
  }

  return (
    <ul {...props} className={styles.errorList}>
      {errors.map((error) => (
        <li key={error} className={styles.errorItem}>
          {error}
        </li>
      ))}
    </ul>
  );
}
