import * as styles from './form-error-list.css.ts';

interface Props {
  errors: Array<string>;
  id: string;
}

export function FormErrorList(props: Props) {
  const errors = props.errors.filter(Boolean);

  if (errors.length === 0) {
    return null;
  }

  return (
    <ul className={styles.container} id={props.id}>
      {errors.map((error) => (
        <li key={error} className={styles.error}>
          {error}
        </li>
      ))}
    </ul>
  );
}
