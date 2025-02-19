import { execa as execa_ } from 'execa';

export const execa = execa_({
  stdout: 'inherit',
  stderr: 'inherit',
});
