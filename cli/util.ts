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
