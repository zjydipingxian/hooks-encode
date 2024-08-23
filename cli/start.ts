import { execa } from 'execa';

// 启动 generate-docs 脚本
const generateDocs = execa('pnpm', ['run', 'build:file'], { stdio: 'inherit' });

// 启动 VitePress 服务
const vitepress = execa('vitepress', ['dev', 'docs'], { stdio: 'inherit' });

// 启动 watch 脚本
const watch = execa('pnpm', ['run', 'wt'], { stdio: 'inherit' });

// 捕获错误
generateDocs.catch((error) => {
  console.error('generate-docs 脚本失败:', error);
  process.exit(1);
});

vitepress.catch((error) => {
  console.error('VitePress 启动失败:', error);
  process.exit(1);
});

watch.catch((error) => {
  console.error('Watch 脚本启动失败:', error);
  process.exit(1);
});
