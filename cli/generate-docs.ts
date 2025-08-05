import fs from 'fs-extra';
import { join } from 'path';
import { packagesDir } from './util.ts';
import generate from './generate';

// 获取 docs 下的文件目录地址
// const docsDir = resolve(__dirname, '../docs');
// import { createUseHooksDemo, createUseHooksMd } from './template.ts';

fs.readdirSync(packagesDir).forEach(async (packageName) => {
  const packagePath = join(packagesDir, packageName);
  if (fs.statSync(packagePath).isDirectory()) {
    generate(packagesDir, packageName, 'Other');
    // console.log('🚀 ~ fs.readdirSync ~ packagesDir, packageName:', packagesDir, packageName);
  }
});
