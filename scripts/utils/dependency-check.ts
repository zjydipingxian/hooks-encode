import fs from 'fs-extra';
import glob from 'fast-glob';
import { join, normalize, relative } from 'path';

import { PATHS } from './paths';

/**
 * 依赖信息接口
 * @interface DependencyInfo
 * @property {boolean} hasDependencies - 是否有依赖项
 * @property {string[]} dependencies - 依赖项列表
 * @property {string[]} files - 相关文件列表
 */
interface DependencyInfo {
  hasDependencies: boolean;
  dependencies: string[];
  files: string[];
}

export async function checkHooksDependencies(hooksName: string): Promise<DependencyInfo> {
  const result: DependencyInfo = {
    hasDependencies: false,
    dependencies: [],
    files: [],
  };

  const hookNameToSearch = `${hooksName}`;

  // 更可靠地定义 hook 自己的目录路径，以便在搜索中排除它。
  const hookDir = join(PATHS.hooks, `${hookNameToSearch}`);

  try {
    // 搜索所有可能包含组件引用的文件
    const files = await glob([
      'packages/**/*.{vue,ts,tsx}',
      'docs/**/*.{md,mdx,vue,js}',
      'docs/.vitepress/**/*.{md,mdx,vue,js}',
      '!**/node_modules/**',
      '!**/dist/**',
      '!**/es/**',
      '!**/lib/**',
    ]);

    for (const file of files) {
      // 规范化路径以处理不同的操作系统分隔符（'/' vs '\'）
      const normalizedFile = normalize(file);
      const normalizedHookDir = normalize(hookDir);

      // 跳过任何位于 hook 自身目录中的文件。
      if (normalizedFile.startsWith(normalizedHookDir)) {
        continue;
      }

      const content = await fs.readFile(file, 'utf-8');

      // 使用一个更通用的正则表达式来查找 hook 的使用情况。
      // `\b` 是一个单词边界，确保我们匹配整个单词 "useHookName"
      // 而不是其他单词中的部分匹配。这比匹配确切的导入路径更简单、更灵活。

      // 所有可能的引用模式
      const patterns = [
        new RegExp(`\\b${hookNameToSearch}\\b`),
        new RegExp(`${hookNameToSearch}\\b`, 'g'),
        new RegExp(`${hookNameToSearch}\\b`, 'gi'),
      ];

      const hasMatch = patterns.some((pattern) => pattern.test(content));

      // const usagePattern = new RegExp(`\\b${hookNameToSearch}\\b`);

      if (hasMatch) {
        result.hasDependencies = true;
        if (!result.dependencies.includes(hooksName)) {
          result.dependencies.push(hooksName);
        }
        // 存储相对于项目根目录的路径，以获得更清晰的日志。
        result.files.push(relative(PATHS.root, file));
      }

      // if (result.hasDependencies) {
      //   console.log(`[Dependency Check] Found dependencies for ${hookNameToSearch}:`);
      //   console.log('  Files using this hook:', result.files);
      // } else {
      //   console.log(`[Dependency Check] No dependencies found for ${hookNameToSearch}.`);
      // }
    }
    return result;
  } catch (error) {
    console.error('依赖检查失败:', error);
    throw error;
  }
}
