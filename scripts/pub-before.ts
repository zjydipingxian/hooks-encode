import { execSync } from 'child_process';
import chalk from 'chalk';

// 发布前
const pubBefore = async () => {
  try {
    // 确保在主分支
    const currentBranch = execSync('git branch --show-current').toString().trim();
    if (currentBranch !== 'master') {
      throw new Error('只允许在 master 分支上发布');
    }

    // 按顺序执行命令
    const commands = [
      'pnpm run clean-dist &&  pnpm run build',
      'pnpm run changeset',
      'pnpm changeset version',
      'git add .',
      'git commit -m "chore: publish packages"',
      'git push',
    ];

    for (const command of commands) {
      try {
        console.log(chalk.blue(`执行命令: ${command}`));
        execSync(command, { stdio: 'inherit' });
        console.log(chalk.green(`命令执行成功: ${command}`));
      } catch (error) {
        console.error(chalk.red(`命令执行失败: ${command}`), error);
        process.exit(1);
      }
    }

    console.log(chalk.green('预构建成功'));
  } catch (error) {
    console.error(chalk.red('Failed to publish:'), error);
    process.exit(1);
  }
};

pubBefore();
