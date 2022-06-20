#!/usr/bin/env node
import { program } from 'commander';
import { serve } from './serve';
import { compile } from './build';

function build() {
  compile();
}

program
  .command('start')
  .option('-p, --port <number>')
  .action(function action() {
    const options = this.opts();
    serve({
      port: Number.parseInt(options.port, 10),
    });
  });

program.command('build').option('Build demos').action(build);

program.parse();
