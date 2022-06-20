import { program } from 'commander';
import start from './actions/start';
import create from './actions/create';

program.command(create.name).option('Create a new demo').action(create);

program.command(start.name).option('Start demos development').action(start);

program.parse();
