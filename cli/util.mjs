import fs from 'fs-extra';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = dirname(fileURLToPath(import.meta.url)); // -> F:\growth_log\手写\Vue3\scripts
export const require = createRequire(import.meta.url);

export const packagesDir = resolve(__dirname, '../packages/hooks/src');
console.log('🚀 ~ packagesDir:', packagesDir);

// 使用 fs-extra 的异步版本
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
