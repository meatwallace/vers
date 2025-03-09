#!/usr/bin/env node

import { Command } from 'commander';
import { execa } from 'execa';
import { oraPromise } from 'ora';
import { parseCommaSeperatedStrings } from './utils/parse-comma-seperated-strings.ts';

const defaultFilesToFormat = ['.'];

const prettierSpinnerConfig = {
  text: 'Formatting files with Prettier...',
  successText: 'Prettier completed',
  failText: 'Prettier failed',
};

interface FormatArgs {
  files: Array<string> | undefined;
  check: boolean;
}

const program = new Command()
  .name('format')
  .description('CLI to format files')
  .option('-f, --files <files>', 'files to format', parseCommaSeperatedStrings)
  .option('-c, --check', 'check if files are formatted')
  .action(async ({ files, check }: FormatArgs) => {
    await formatFiles(files, check);
  });

async function formatFiles(
  commaSeperatedFiles: Array<string> | undefined,
  check: boolean,
) {
  let files = defaultFilesToFormat.join(' ');

  if (commaSeperatedFiles) {
    // some of our folders include $ so we need to escape it to pass it as a shell argument
    files = commaSeperatedFiles.join(' ').replaceAll('$', String.raw`\$`);
  }

  const modeArg = check ? '-c' : '-w';

  console.log(`prettier ${modeArg} ${files}`);

  try {
    await oraPromise(
      execa({ shell: true })`prettier ${modeArg} ${files}`,
      prettierSpinnerConfig,
    );
  } catch {
    process.exit(1);
  }
}

program.parse();
