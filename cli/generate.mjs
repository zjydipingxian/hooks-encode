// 用来 创建 基本 每个 hooksXXX 需要的 模板 以及准备工作 模板
import fs from 'fs-extra';
import { resolve, join } from 'path';
import { __dirname, createHooksDirectoryAndFiles } from './util.mjs';
import { buildImportExport } from './build-entry.mjs';

// 获取 docs 下的文件目录地址
const docsDir = resolve(__dirname, '../docs');

export default async function generate(packagesDir, folderName, hooksType) {
  // 创建目录 以及 目录对应需要的内容
  await createHooksDirectoryAndFiles(packagesDir, folderName, hooksType);

  // 获取 packages/hooks/src/index.ts 文件的路径
  const indexFilePath = join(packagesDir, 'index.ts');

  // 读取现有的 index.ts 文件内容
  // const hooksDirs = await checkDirectories();
  const template = await buildImportExport(packagesDir, folderName);
  // fs.writeFileSync(indexFilePath, template);

  const sourceDir = join(packagesDir, folderName);
  const targetDir = join('docs', folderName);

  // 确保目标目录存在
  await fs.ensureDir(targetDir);

  // 复制目录内容，排除 index.ts
  const exclusions = ['index.ts', 'meta.json'];
  await fs.copy(sourceDir, targetDir, {
    filter: (src) => {
      // 遍历排除列表，检查文件路径是否匹配其中任何一个
      for (const exclusion of exclusions) {
        if (src.endsWith(exclusion) || src.includes(exclusion)) {
          return false; // 匹配到排除项，过滤该文件
        }
      }
      return true; // 没有匹配到排除项，保留该文件
    },
  });
}
