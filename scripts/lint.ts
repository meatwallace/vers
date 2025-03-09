#!/usr/bin/env node

import { Command } from 'commander';
import { oraPromise } from 'ora';
import { execa } from './utils/execa.ts';
import { parseCommaSeperatedStrings } from './utils/parse-comma-seperated-strings.ts';

const filesToLint = ['projects/', 'scripts/'];

const eslintSpinnerConfig = {
  text: 'Checking files with ESLint...',
  successText: 'ESLint completed',
  failText: 'ESLint failed',
};

interface LintArgs {
  files: Array<string> | undefined;
  fix: boolean;
}

const program = new Command()
  .name('lint')
  .description('CLI to lint files')
  .option('-f, --files <files>', 'files to lint', parseCommaSeperatedStrings)
  .option('--fix', 'fix linting errors', false)
  .action(async ({ files, fix }: LintArgs) => {
    await lintFiles(files, fix);
  });

async function lintFiles(
  commaSeperatedFiles: Array<string> | undefined,
  fix: boolean,
) {
  let files = filesToLint.join(' ');

  if (commaSeperatedFiles) {
    // some of our folders include $ so we need to escape it to pass it as a shell argument
    files = commaSeperatedFiles.join(' ').replaceAll('$', String.raw`\$`);
  }

  const fixArg = fix ? '--fix' : '';

  try {
    await oraPromise(
      execa({ shell: true })`eslint ${fixArg} ${files}`,
      eslintSpinnerConfig,
    );
  } catch {
    process.exit(1);
  }
}

program.parse();
