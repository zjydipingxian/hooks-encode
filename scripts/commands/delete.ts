import { input, confirm } from '@inquirer/prompts';
import chalk from 'chalk'; // 导入用于在命令行中输出彩色文本的库

import { checkDirectories, deleteHooks } from '../utils';
import { checkHooksDependencies } from '../utils/dependency-check';

export const remove = async (name?: string) => {
  // const removeDir = name ? name : 'docs';

  try {
    // 获取要删除的组件名
    const hookName = await input({
      message: '请输入要删除的 Hooks 名称:',
      validate: async (input) => {
        const existsValidation = await checkDirectories(input);
        if (existsValidation !== true) return true;
        return `Hooks ${input} 不存在`;
      },
    });

    // 检查组件依赖
    const dependencies = await checkHooksDependencies(hookName);
    if (dependencies.hasDependencies) {
      console.log(
        chalk.yellow(`\n⚠️  警告: 该 ${chalk.red(hookName)} 被以下文件引用: 共 ${chalk.red(dependencies.files.length)} 个文件`),
      );

      dependencies.files.forEach((file) => {
        console.log(chalk.yellow(`  - ${file}`));
      });

      const forceDeletion = await confirm({
        message: chalk.red('组件存在依赖关系，确定要强制删除吗？'),
        default: false,
      });

      if (!forceDeletion) {
        console.log(chalk.yellow('删除操作已取消'));
        return;
      }

      // TODO: 需要备份一下

      // 最终确认删除
      const shouldDelete = await confirm({
        message: chalk.red(`⚠️ 最后确认: 删除 ${chalk.red(hookName)}? 此操作不可恢复！`),
        default: false,
      });

      if (shouldDelete) {
        // TODO 删除
        await deleteHooks(hookName);
      } else {
        console.log(chalk.yellow('删除操作已取消'));
      }
    }
  } catch (error) {
    console.error(chalk.red('错误:'), error);
    process.exit(1);
  }
};
