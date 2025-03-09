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

There will be a [memory file](../../.memory.md) for can maintain.

The memory file will contain:

- Requirements and specifications
- Technical details of the implementation
- Security research findings
- Design decisions
- Pending decisions
- Questions for the user

Keep it succint and up to date based on the task's current state.

## Track Relevant Rules

For each major task or feature area:

1. Reference relevant cursor rules in the todo list items
2. Review referenced rules before starting each task
3. Update rules when:
   - New implementation standards are discovered
   - Tasks require additional standards
   - File changes trigger automatic rule attachments

## Update cursor rules

If necessary, update the cursor rules to reflect anything you've learned while working on the task.
