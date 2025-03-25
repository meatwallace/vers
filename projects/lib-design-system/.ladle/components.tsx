import type { GlobalProvider } from '@ladle/react';
import { Heading } from '../src/components/heading/heading';
import '../src/styled-system/styles.css';

export const Provider = (props: Parameters<GlobalProvider>[0]) => (
  <>
    <Heading level={1}>{props.globalState.story}</Heading>
    {props.children}
  </>
);
