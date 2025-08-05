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

    // TODO: 构建
    execSync('pnpm run clean-dist &&  pnpm run build', { stdio: 'inherit' });

    execSync('pnpm run changeset', { stdio: 'inherit' });

    // 创建版本并更新依赖
    execSync('pnpm changeset version', { stdio: 'inherit' });

    // TODO: 发布包
    // execSync('pnpm changeset publish', { stdio: 'inherit' })

    // 提交变更
    execSync('git add .');
    execSync('git commit -m "chore: publish packages"');
    execSync('git push');

    console.log(chalk.green('Successfully published packages'));
  } catch (error) {
    console.error(chalk.red('Failed to publish:'), error);
    process.exit(1);
  }
};

pubBefore();
