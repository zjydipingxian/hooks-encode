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

// 获取每个 hooks 文件夹
// const packagePath = join(packagesDir, packageName);

// if (fs.statSync(packagePath).isDirectory()) {
//   // 在判断 有没有 demo 文件以及  以及 index.md  没有的话 就帮忙创建一个
//   if (!fs.existsSync(join(packagePath, 'demo'))) {
//     fs.mkdirSync(join(packagePath, 'demo'));
//     fs.writeFile(join(packagePath, 'demo', 'index.vue'), createUseHooksDemo(packageName));
//   }
//   if (!fs.existsSync(join(packagePath, 'index.md'))) {
//     fs.writeFileSync(join(packagePath, 'index.md'), createUseHooksMd(packageName));
//   }

//   const sourceDir = join(packagesDir, packageName);
//   const targetDir = join('docs', packageName);

//   // 确保目标目录存在
//   await fs.ensureDir(targetDir);

//   // 复制目录内容，排除 index.ts
//   await fs.copy(sourceDir, targetDir, {
//     filter: (src) => !src.endsWith('index.ts'),
//   });
// }
