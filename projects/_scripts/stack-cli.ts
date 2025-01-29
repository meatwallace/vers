#!/usr/bin/env node

import { Command as Commander } from 'commander';
import { ServiceID } from '@chrono/service-types';
import { parseServiceArg } from './stack/utils/parse-service-arg.ts';
import { start, type StartOptions } from './stack/commands/start.ts';
import { stop } from './stack/commands/stop.ts';
import { logs } from './stack/commands/logs.ts';
import { status } from './stack/commands/status.ts';
import { exec } from './stack/commands/exec.ts';

const program = new Commander()
  .name('stack')
  .description('CLI to manage the development stack');

program
  .command('start')
  .description('Start services')
  .argument('[service]', 'service to start', parseServiceArg)
  .option('-b, --build', 'build images before starting', false)
  .option('-f, --force-recreate', 'force recreation of containers', false)
  .action(async (service?: ServiceID, options?: StartOptions) => {
    await start(service, options);
  });

program
  .command('stop')
  .description('Stop services')
  .argument('[service]', 'service to stop', parseServiceArg)
  .action(async (service?: ServiceID) => {
    await stop(service);
  });

program
  .command('logs')
  .description('Follow service logs')
  .argument('[service]', 'service to follow logs for', parseServiceArg)
  .action(async (service?: ServiceID) => {
    await logs(service);
  });

program
  .command('status')
  .description('Show services status')
  .action(async () => {
    await status();
  });

program
  .command('exec')
  .description('Execute a command in a service container')
  .argument('<service>', 'service to execute command in', parseServiceArg)
  .argument('<command...>', 'command to execute')
  .action(async (service: ServiceID, command: string[]) => {
    await exec(service, command);
  });

program.parse();
