import { CheckboxField } from './checkbox-field';

export const Default = () => {
  return (
    <CheckboxField
      checkboxProps={{
        id: 'remember-me',
      }}
      errors={[]}
      labelProps={{
        children: 'Remember me',
      }}
    />
  );
};
