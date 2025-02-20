#!/usr/bin/env node

import { Command } from 'commander';
import { oraPromise } from 'ora';
import { execa } from './utils/execa.ts';
import { parseCommaSeperatedStrings } from './utils/parse-comma-seperated-strings.ts';

const filesToLint = [
  'projects/**/*.mjs',
  'projects/**/*.ts',
  'projects/**/*.tsx',
  'scripts/**/*.ts',
];

const eslintSpinnerConfig = {
  text: 'Checking files with ESLint...',
  successText: 'ESLint completed',
  failText: 'ESLint failed',
};

type LintArgs = {
  files: Array<string>;
  fix: boolean;
};

const program = new Command()
  .name('lint')
  .description('CLI to lint files')
  .option('-f, --files <files>', 'files to lint', parseCommaSeperatedStrings)
  .option('--fix', 'fix linting errors', false)
  .action(async ({ files, fix }: LintArgs) => {
    await lintFiles(files, fix);
  });

async function lintFiles(commaSeperatedFiles: Array<string>, fix: boolean) {
  let files = filesToLint.join(' ');

  if (commaSeperatedFiles) {
    files = commaSeperatedFiles.join(' ');
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
