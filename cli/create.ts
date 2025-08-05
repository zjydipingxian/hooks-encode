import { input, select } from '@inquirer/prompts';
import ora from 'ora';
import generate from './generate';

// 检查文件夹
import { checkDirectories, packagesDir, validateHooksName } from './util.ts';

import { updateCreateRouterFile } from './route-map.ts';

export default async () => {
  // 输入 Hooks 名称  作为 Hooks 文件夹名称
  const folderName = await input({
    message: '（必填）请输入Hooks name ，将用作目录及文件名：',
    validate: async (value) => {
      const nameValidation = validateHooksName(value);
      if (nameValidation !== true) return nameValidation; // 如果验证失败，返回错误信息

      // 检查组件是否已存在
      const hooksDirs = await checkDirectories(value);
      if (hooksDirs !== true) return hooksDirs; // 如果组件已存在，返回错误信息

      return true;
    },
  });

  // 这个Hooks 文件夹 的 描述
  const description = await input({
    message: '（必填）请输入Hooks 描述：',
    validate: async (value) => {
      if (value.trim() === '') {
        return 'Hooks 描述 是必填项！';
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
  await updateCreateRouterFile(hooksType, folderName);
  routerOra.succeed(`路由映射关系注入成功`);

  const folderNameOra = ora();
  folderNameOra.start(`${folderName} 正在创建中！！！`);

  await generate(packagesDir, folderName, hooksType, description);

  folderNameOra.succeed(`${folderName} 创建成功！！！`);

  //  打印 创建成功信息
  console.log(`\nHooks ${folderName} 创建成功！`);
};
