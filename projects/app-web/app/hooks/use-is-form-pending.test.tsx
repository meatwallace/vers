import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Form, createMemoryRouter, RouterProvider } from 'react-router';
import userEvent from '@testing-library/user-event';
import { useIsFormPending } from './use-is-form-pending';

type FormMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
type HTMLFormMethod = 'post' | 'get' | 'put' | 'patch' | 'delete';

interface Props {
  isPendingAction: string;
  isPendingMethod: HTMLFormMethod;
  formAction: string;
  formMethod: HTMLFormMethod;
}

function TestForm(props: Props) {
  const isPending = useIsFormPending({
    formAction: props.isPendingAction,
    formMethod: props.isPendingMethod.toUpperCase() as FormMethod,
  });

  return (
    <Form action={props.formAction} method={props.formMethod}>
      <input type="text" name="test" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
    </Form>
  );
}

interface TestConfig {
  isPendingAction: string;
  isPendingMethod: HTMLFormMethod;
  formAction: string;
  formMethod: HTMLFormMethod;
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const router = createMemoryRouter([
    {
      path: '/',
      element: (
        <TestForm
          isPendingAction={config.isPendingAction}
          isPendingMethod={config.isPendingMethod}
          formAction={config.formAction}
          formMethod={config.formMethod}
        />
      ),
    },
    {
      path: '/test',
      action: async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        return null;
      },
    },
    {
      path: '/custom',
      action: async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        return null;
      },
    },
  ]);

  render(<RouterProvider router={router} />);

  return { user };
}

test('it returns false when no form submission is pending', () => {
  setupTest({
    isPendingAction: '/test',
    isPendingMethod: 'post',
    formAction: '/test',
    formMethod: 'post',
  });

  const submitButton = screen.getByRole('button');

  expect(submitButton).toHaveTextContent('Submit');
  expect(submitButton).not.toBeDisabled();
});

test('it returns true when form submission matches the action and method', async () => {
  const { user } = setupTest({
    isPendingAction: '/test',
    isPendingMethod: 'post',
    formAction: '/test',
    formMethod: 'post',
  });

  const submitButton = screen.getByRole('button');

  await user.click(submitButton);

  expect(submitButton).toHaveTextContent('Submitting...');
  expect(submitButton).toBeDisabled();
});

test('it returns false when form submission uses a different method', async () => {
  const { user } = setupTest({
    isPendingAction: '/test',
    isPendingMethod: 'post',
    formAction: '/test',
    formMethod: 'get',
  });

  const submitButton = screen.getByRole('button');

  await user.click(submitButton);

  expect(submitButton).toHaveTextContent('Submit');
  expect(submitButton).not.toBeDisabled();
});

test('it returns false when form submission uses a different action', async () => {
  const { user } = setupTest({
    isPendingAction: '/test',
    isPendingMethod: 'post',
    formAction: '/other',
    formMethod: 'post',
  });

  const submitButton = screen.getByRole('button');

  await user.click(submitButton);

  expect(submitButton).toHaveTextContent('Submit');
  expect(submitButton).not.toBeDisabled();
});

test('it returns true when form submission matches a custom action and method', async () => {
  const { user } = setupTest({
    isPendingAction: '/custom',
    isPendingMethod: 'put',
    formAction: '/custom',
    formMethod: 'put',
  });

  const submitButton = screen.getByRole('button');

  await user.click(submitButton);

  expect(submitButton).toHaveTextContent('Submitting...');
  expect(submitButton).toBeDisabled();
});
