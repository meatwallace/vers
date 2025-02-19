#!/usr/bin/env node

import { Command } from 'commander';
import { execa, ExecaError } from 'execa';
import { oraPromise } from 'ora';
import { parseCommaSeperatedStrings } from './utils/parse-comma-seperated-strings.js';

const defaultFilesToFormat = [
  '*.graphql',
  '*.js',
  '*.json',
  '*.md',
  '*.yml',
  '.github/**/*.yml',
  '"projects/**/*.html"',
  '"projects/**/*.js"',
  '"projects/**/*.json"',
  '"projects/**/*.mjs"',
  '"projects/**/*.ts"',
  '"projects/**/*.tsx"',
  '"scripts/**/*.ts"',
];

const prettierSpinnerConfig = {
  text: 'Formatting files with Prettier...',
  successText: 'Prettier completed',
  failText: 'Prettier failed',
};

type FormatArgs = {
  files: Array<string>;
  check: boolean;
};

const program = new Command()
  .name('format')
  .description('CLI to format files')
  .option('-f, --files <files>', 'files to format', parseCommaSeperatedStrings)
  .option('-c, --check', 'check if files are formatted')
  .action(async ({ files, check }: FormatArgs) => {
    await formatFiles(files, check);
  });

async function formatFiles(commaSeperatedFiles: Array<string>, check: boolean) {
  let files = defaultFilesToFormat.join(' ');

  if (commaSeperatedFiles) {
    files = commaSeperatedFiles.join(' ');
  }

  const modeArg = check ? '-c' : '-w';

  try {
    await oraPromise(
      execa({ shell: true })`prettier ${modeArg} ${files}`,
      prettierSpinnerConfig,
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
