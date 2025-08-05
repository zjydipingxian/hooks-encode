#!/usr/bin/env node
import { program } from 'commander';
import { create } from './commands/create';

program.command('create').description('请创建一个新组件').action(create);

program.parse();
