import fs from 'fs-extra';
import { createRequire } from 'module';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { format } from 'prettier';

// 创建模板
import { createUseHooksTemplate, createUseHooksDemo, createUseHooksMd, createMeta } from './template.ts';

export const __dirname = dirname(fileURLToPath(import.meta.url));
export const require = createRequire(import.meta.url);

export const packagesDir = resolve(__dirname, '../packages/hooks/src');
export const prettierConfig = fs.readFileSync(resolve(__dirname, '../', '.prettierrc.json'), 'utf-8');

// 检查文件夹是否存在过
export async function checkDirectories(name: string) {
  const componentDir = resolve(packagesDir, name);

  if (await fs.pathExists(componentDir)) {
    return `Hooks ${name} 已存在`;
  }
  return true;
}

// 创建 hooks 目录和文件夹
export async function createHooksDirectoryAndFiles(packagesDir, folderName, hooksType, description) {
  const path = join(packagesDir, folderName);

  // 检查目录是否存在
  const exists = await fs.pathExists(path);
  if (!exists) {
    // 创建 Hooks 目录
    await fs.ensureDir(join(packagesDir, folderName));
  }

  // 在 Hooks 目录下创建 demo 目录和 index.vue 文件
  createDemo(path, folderName);

  // 在 Hooks 目录下创建 index.ts 以及 index.md 文件

  // 检查并创建 index.md 文件
  await ensureFile(join(path, 'index.md'), () => createUseHooksMd(folderName, description));
  // 检查并创建 index.ts 文件
  await ensureFile(join(path, 'index.ts'), () => createUseHooksTemplate(folderName));

  // 检查并创建 meta.json 文件
  const formatMeta = await format(createMeta(hooksType), { ...prettierConfig, parser: 'json' });
  await ensureFile(join(path, 'meta.json'), () => {
    return formatMeta;
  });
}

// 目录下创建 demo 目录和 index.vue 文件
export async function createDemo(path, folderName) {
  const demoPath = join(path, 'demo');

  // 检查 demo 目录是否存在
  const demoExists = await fs.pathExists(demoPath);
  if (!demoExists) {
    await fs.ensureDir(join(path, 'demo'));
    await fs.writeFile(join(path, 'demo', 'index.vue'), createUseHooksDemo(folderName));
  }
}

// 通用的检查和创建文件的方法
async function ensureFile(filePath, contentGenerator) {
  const exists = await fs.pathExists(filePath);
  if (!exists) {
    await fs.writeFileSync(filePath, contentGenerator());
  } else {
    // console.log(`File ${filePath} already exists. Skipping creation.`);
  }
}

// hooks name

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
