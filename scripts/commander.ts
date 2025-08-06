#!/usr/bin/env node
import { program } from 'commander';
import { create, remove } from './commands';

program.command('create').description('请创建一个新hooks目录').action(create);
program.command('delete').description('请删除一个hooks目录').action(remove);

program.parse();
