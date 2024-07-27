#!/usr/bin/env node
import { program } from 'commander';

// 执行创建模板
import create from './create.mjs';

program
  .command('init')
  .description('一键创建Hooks 文件模块')
  .action(async () => {
    create();
  });

program.parse();
