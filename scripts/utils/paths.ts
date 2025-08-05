import fs from 'fs-extra';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的目录名
export const __dirname = dirname(fileURLToPath(import.meta.url));

// 定义项目中常用路径的常量
export const PATHS = {
  root: resolve(__dirname, '../../'), // 项目根目录
  hooks: resolve(__dirname, '../../packages/hooks/src'), // hooks目录
  hooksEntry: resolve(__dirname, '../../packages/hooks/src/index.ts'), // hooks入口文件
  docsDir: resolve(__dirname, '../../docs'), // docs入口文件
  prettierConfig: fs.readFileSync(resolve(__dirname, '../../.prettierrc.json'), 'utf-8'), // prettier配置文件
} as const;
