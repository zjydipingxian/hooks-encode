import { format } from 'prettier';
import fs from 'fs-extra';
import { resolve } from 'path';
import { PATHS } from './paths';

// 格式化代码的函数
export const formatCode = async (code: string, filename?: string) => {
  // 获取 Prettier 配置文件的路径
  const configPath = resolve(PATHS.root, '.prettierrc.json');

  // 读取并解析 Prettier 配置文件
  const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));

  // 根据文件扩展名选择解析器
  const parser = filename?.endsWith('.vue') ? 'vue' : 'typescript';

  // 使用 Prettier 格式化代码
  return format(code, {
    ...config,
    parser,
  });
};
