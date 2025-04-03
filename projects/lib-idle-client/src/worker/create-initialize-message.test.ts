import { expect, test } from 'vitest';
import { ClientMessageType } from '../types';
import { createInitializeMessage } from './create-initialize-message';

test('it creates an initialize message', () => {
  const message = createInitializeMessage();

  expect(message).toStrictEqual({
    type: ClientMessageType.Initialize,
  });
});
