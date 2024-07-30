import fs from 'fs-extra';
import { createRequire } from 'module';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
// 创建模板
import { createUseHooksTemplate, createUseHooksDemo, createUseHooksMd } from './template.mjs';

export const __dirname = dirname(fileURLToPath(import.meta.url));
export const require = createRequire(import.meta.url);

export const packagesDir = resolve(__dirname, '../packages/hooks/src');

// 检查文件夹是否存在过
export async function checkDirectories() {
  try {
    const files = await fs.readdir(packagesDir);
    const dirs = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.lstat(resolve(packagesDir, file));
        return stats.isDirectory() ? file : null;
      }),
    );
    const filteredDirs = dirs.filter(Boolean);
    return filteredDirs;
  } catch (error) {
    console.log('🚀 ~ checkDirectories ~ error:', error);
  }
}

// 创建 hooks 目录和文件夹
export async function createHooksDirectoryAndFiles(packagesDir, folderName) {
  const path = join(packagesDir, folderName);

  // 创建 Hooks 目录
  await fs.ensureDir(join(packagesDir, folderName));

  // 在 Hooks 目录下创建 demo 目录和 index.vue 文件
  createDemo(path, folderName);

  // 在 Hooks 目录下创建 index.ts 以及 index.md 文件
  await fs.writeFile(join(path, 'index.md'), createUseHooksMd(folderName));
  await fs.writeFile(join(path, 'index.ts'), createUseHooksTemplate(folderName));
}

// 目录下创建 demo 目录和 index.vue 文件
export async function createDemo(path, folderName) {
  await fs.ensureDir(join(path, 'demo'));
  await fs.writeFile(join(path, 'demo', 'index.vue'), createUseHooksDemo(folderName));
}
