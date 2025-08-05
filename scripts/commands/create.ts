import { input, select, confirm } from '@inquirer/prompts';

import chalk from 'chalk'; // 导入用于在命令行中输出彩色文本的库

import { validateHooksName, hooksTypeVars, createHooksFile, checkDirectories } from '../utils';

export const create = async () => {
  try {
    // 输入 Hooks 名称  作为 Hooks 文件夹名称
    const folderName = await input({
      message: '（必填）请输入Hooks name ，将用作目录及文件名：',
      validate: async (value) => {
        // 验证组件名称是否合法
        const nameValidation = validateHooksName(value);
        if (nameValidation !== true) return nameValidation;

        // 验证 Hooks name 名称 是否重复
        const hooksDirs = await checkDirectories(value);
        if (hooksDirs !== true) return hooksDirs;

        return true;
      },
    });

    // 这个Hooks 文件夹 的 描述
    const description = await input({
      message: '（必填）请输入Hooks 描述：',
      validate: async (value) => {
        if (value.trim() === '') {
          return 'Hooks 描述 是必填项！';
        }

        return true;
      },
    });

    // 请选择文件夹用途分类
    const hooksType = await select({
      message: '请选择Hooks用途分类：',
      choices: hooksTypeVars,
    });

    // 确认创建
    const shouldCreate = await confirm({
      message: `是否创建Hooks  ${chalk.green(folderName)} 文件?`,
      default: true,
    });

    if (shouldCreate) {
      await createHooksFile(folderName, description, hooksType); // 如果用户确认创建，调用函数创建Hooks 文件
    } else {
      console.log(chalk.red(`${chalk.yellow(folderName)}  创建取消`)); // 如果用户取消创建，输出取消信息
    }
  } catch (error) {
    console.error(chalk.red('错误:'), error);
    process.exit(1);
  }
};
