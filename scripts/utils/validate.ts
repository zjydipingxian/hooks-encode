import { resolve } from 'path';
import { PATHS } from './paths';
import fs from 'fs-extra';

/**
 * 验证 hooks name 名称。
 *
 * @param {string} name - 要验证的 hooks name 名称。
 * @returns {string|boolean} - 如果名称无效，则返回错误信息，否则返回 true。
 */
export function validateHooksName(name: string) {
  if (name.trim() === '') {
    return 'Hooks name 是必填项！';
  }
  // 检查是否以 use 开头
  if (!name.startsWith('use')) {
    return 'Hooks name 必须以 use 开头';
  }

  // 检查是否只包含字母
  if (!/^[a-zA-Z]+$/.test(name)) {
    return 'Hooks name 只能包含字母';
  }

  // 检查 Hooks name 是否 是 use 开头 必须小写
  if (!name.startsWith('use') || name.substring(3).trim() === '') {
    return `Hooks ${name} 必须以 use 开头，并且 use 后面必须有其他内容！`;
  }

  return true;
}

// 检查文件夹是否存在过
export async function checkDirectories(name: string) {
  const componentDir = resolve(PATHS.hooks, name);

  if (await fs.pathExists(componentDir)) {
    return `Hooks ${name} 已存在`;
  }
  return true;
}
