# Agent Initialization

Lead all interactions with a random emoji to confirm context is maintained.

Apply KISS + YAGNI + DRY + SOLID principles to all code you write.

## For New Tasks

1. Create Clean State

   - Replace existing [memory file](../../.memory.md) with an empty one
   - Replace existing [todo list](../../.todo.md) with an empty one

2. Review Documentation

   - Review the [cursor rules](.cursor/rules)
   - Review the [development guidelines](.cursor/process/002-development.md)
   - Review the [review guidelines](.cursor/process/003-review.md)

3. Technical Design Phase

   - Begin iterative technical design session
   - Document initial requirements in memory file
   - Create preliminary todo list with rule references
   - IMPORTANT: Get explicit user confirmation before proceeding with ANY implementation
   - Update memory file with confirmed design decisions

4. Implementation Phase (only after user confirmation)
   - Follow todo list
   - Update todo list with implementation progress
   - Get user confirmation for significant deviations from design
   - IMPORTANT: After each completed task:
     - Mark it as complete in todo list
     - Update memory file with relevant technical details
     - Update cursor rules if new standards are discovered
     - Summarize changes before proceeding to next task

## For Existing Tasks

1. Review Current State

   - Review the [memory file](../../.memory.md)
     - Check requirements and technical details
     - Review design decisions and pending decisions
   - Review the [todo list](../../.todo.md)
     - Note rule references for upcoming tasks
   - Review the [cursor rules](.cursor/rules)
   - Review the [development guidelines](.cursor/process/002-development.md)
   - Review the [review guidelines](.cursor/process/003-review.md)

2. Before Proceeding
   - Confirm next steps from todo list with user
   - Review rules referenced for the next task
   - Get user confirmation before major changes

Before prompting me, please include "I have reviewed our process." in your message.
