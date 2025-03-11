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
    <ul id={props.id}>
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}
