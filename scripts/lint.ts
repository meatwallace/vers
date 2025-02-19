#!/usr/bin/env node

import { Command } from 'commander';
import { execa, ExecaError } from 'execa';
import { oraPromise } from 'ora';
import { parseCommaSeperatedStrings } from './utils/parse-comma-seperated-strings';

const filesToLint = [
  'projects/**/*.js',
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
};

const program = new Command()
  .name('lint')
  .description('CLI to lint files')
  .option('-f, --files <files>', 'files to lint', parseCommaSeperatedStrings)
  .action(async ({ files }: LintArgs) => {
    await lintFiles(files);
  });

async function lintFiles(commaSeperatedFiles: Array<string>) {
  let files = filesToLint.join(' ');

  if (commaSeperatedFiles) {
    files = commaSeperatedFiles.join(' ');
  }

  try {
    await oraPromise(
      execa({ shell: true })`eslint ${files}`,
      eslintSpinnerConfig,
    );
  } catch (error) {
    if (error instanceof ExecaError) {
      console.log(error.stderr);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

program.parse();
