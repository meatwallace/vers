# General Development Guidelines

You should do task-based development. For every task, you should write the tests, implement the code, and run the tests to make sure everything works.

Use `yarn test` to run the tests for the entire repo or use `yarn test:<project-name>` to run a specific project's tests. These scripts can be found in the [`package.json` file](../../package.json).

When the tests pass:

- Update the todo list to reflect the task being completed
- Update the memory file to reflect the current state of the task
- Fix any warnings or errors in the code
- Commit the changes to the repository with a descriptive commit message
- Update the cursor rules to reflect anything that you've learned while working on the task
- Stop and we will open a new chat for the next task

## Retain Memory

There will be a memory file for every project you can store in `.cursor/process/.memory.md`.

The memory file will contain the state of the task, and any notes or relevant details you'd need to remember between chats, including a todo list of sub-tasks to complete.

Keep it up to date based on the task's current state.

## Update cursor rules

If necessary, update the cursor rules to reflect anything you've learned while working on the task.
