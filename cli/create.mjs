import { input } from '@inquirer/prompts';
import fs from 'fs-extra';
import { createRequire } from 'module';
import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import buildEntry from './build-entry.mjs';

// 检查文件夹
import { checkDirectories, packagesDir } from './util.mjs';
// 创建模板
import { createUseHooksTemplate } from './template.mjs';

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

  // 开始 向 packages/hooks/src 下  创建 Hooks目录 文件夹
  fs.mkdirSync(join(packagesDir, folderName), { recursive: true });

  // 在创建好的 Hooks目录 文件夹 下 创建 index.ts 文件
  fs.writeFileSync(join(packagesDir, folderName, 'index.ts'), createUseHooksTemplate(folderName));

  // 最后需要将  在创建好的 Hooks目录 文件夹 下 创建 index.ts 文件 向 packages/hooks/src/index.ts 追加内容
  // 获取 packages/hooks/src/index.ts 文件的路径
  const indexFilePath = join(packagesDir, 'index.ts');

  // 读取现有的 index.ts 文件内容
  // console.log('🚀 ~ indexContent:', indexContent);
  const hooksDirs = await checkDirectories();
  const template = buildEntry(hooksDirs);
  fs.writeFileSync(indexFilePath, template);

  //  打印 创建成功信息
  console.log(`\nHooks ${folderName} 创建成功！`);
};
