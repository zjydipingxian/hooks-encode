import { input, select } from '@inquirer/prompts';
import fs from 'fs-extra';
import { join } from 'path';
import { buildEntry } from './build-entry.mjs';
import ora from 'ora';
import generate from './generate.mjs';

// 检查文件夹
import { checkDirectories, packagesDir, createHooksDirectoryAndFiles } from './util.mjs';

import { updateCreateRouterFile } from './route-map.mjs';

export default async () => {
  // 输入 Hooks 名称  作为 Hooks 文件夹名称
  const folderName = await input({
    message: '（必填）请输入Hooks name ，将用作目录及文件名：',
    validate: async (value) => {
      if (value.trim() === '') {
        return 'Hooks name 是必填项！';
      }

      // 校验 Hooks name 是否合法
      if (!/^[a-zA-Z]+$/.test(value)) {
        return 'Hooks name 只能包含字母！';
      }

      // 检查 Hooks name 是否 是 use 开头 必须小写
      if (!value.startsWith('use') || value.substring(3).trim() === '') {
        return `Hooks ${value} 必须以 use 开头，并且 use 后面必须有其他内容！`;
      }

      // 获取 packages/hooks/src 目录下的文件夹名称
      const hooksDirs = await checkDirectories();
      if (hooksDirs.includes(value)) {
        return 'Hooks name 文件夹已存在！';
      }

      return true;
    },
  });

  // 请选择文件夹用途分类
  const hooksType = await select({
    message: '请选择Hooks用途分类：',
    choices: [
      { name: '业务:      业务相关的分类', value: 'Worker' },
      { name: '效果:      作用，影响相关', value: 'Effect' },
      { name: '状态:      操作状态相关', value: 'State' },
      { name: '文档对象:  操作Dom相关', value: 'Dom' },
      { name: '其他:      其他杂项', value: 'Other' },
    ],
  });

  const routerOra = ora();
  routerOra.start(`路由映射关系正在注入`);
  // 创建路由映射关系表
  const router = await updateCreateRouterFile(hooksType, folderName);
  routerOra.succeed(`路由映射关系注入成功`);

  const folderNameOra = ora();
  folderNameOra.start(`${folderName} 正在创建中！！！`);

  await generate(packagesDir, folderName, hooksType);

  folderNameOra.succeed(`${folderName} 创建成功！！！`);

  //  打印 创建成功信息
  console.log(`\nHooks ${folderName} 创建成功！`);
};

// // 创建目录 以及 目录对应需要的内容
// await createHooksDirectoryAndFiles(packagesDir, folderName);

// // 获取 packages/hooks/src/index.ts 文件的路径
// const indexFilePath = join(packagesDir, 'index.ts');

// // 读取现有的 index.ts 文件内容
// const hooksDirs = await checkDirectories();
// const template = buildEntry(hooksDirs);
// fs.writeFileSync(indexFilePath, template);
// folderNameOra.succeed(`${folderName} 创建成功！！！`);

// const sourceDir = join(packagesDir, folderName);
// const targetDir = join('docs', folderName);

// const copyOra = ora();
// copyOra.start(`${folderName} 正在拷贝到 docs 目录中！！！`);

// // 确保目标目录存在
// await fs.ensureDir(targetDir);

// // 复制目录内容，排除 index.ts
// await fs.copy(sourceDir, targetDir, {
//   filter: (src) => !src.endsWith('index.ts'),
// });

// copyOra.succeed(`${folderName} 拷贝到 docs 目录成功！！！`);
