import ora from 'ora';
import chalk from 'chalk';
import { resolve, join } from 'path';
import fs from 'fs-extra';
import { PATHS } from './paths';
import {
  createMeta,
  createUseHooksDemo,
  createUseHooksMd,
  createUseHooksTemplate,
  createUseHooksTest,
} from '../templates/generateCtx';
import { formatCode } from './format';
import { updateCreateRouterFile } from './route-map';

export const createHooksFile = async (name: string, description: string, type: string) => {
  const spinner = ora('正在创建 hooks 文件...').start();

  // 创建 hooks 目录
  const hooksDir = resolve(PATHS.hooks, name);

  let created = false;

  try {
    // 先尝试创建和格式化所有文件内容，但不写入

    const files: Record<string, string> = {
      'demo/index.vue': await formatCode(createUseHooksDemo(name), 'index.vue'),
      [`${hooksDir}/index.md`]: createUseHooksMd(name, description),
      [`${hooksDir}/index.ts`]: await formatCode(createUseHooksTemplate(name), 'index.ts'),
      [`${hooksDir}/meta.json`]: createMeta(type),
      '__tests__/index.test.ts': await formatCode(createUseHooksTest(name), 'index.test.ts'),
    };

    // 创建目录结构
    await fs.ensureDir(hooksDir);
    await fs.ensureDir(resolve(hooksDir, 'demo'));
    await fs.ensureDir(resolve(hooksDir, '__tests__'));

    // 写入文件
    for (const [file, content] of Object.entries(files)) {
      await fs.writeFile(resolve(hooksDir, file), content);
    }

    created = true;

    // 更新入口文件
    await updateComponentsEntry(hooksDir, name);

    // 把文件 copy 到 docs
    await copyFileDoc(hooksDir, name);

    // 更新路由映射关系表
    await updateCreateRouterFile(name, 'add', type);

    spinner.succeed(chalk.green(`hooks ${name} 创建成功！`));
  } catch (error) {
    spinner.fail(chalk.red(`hooks ${name} 创建失败`));
    // 如果文件已经创建，但后续步骤失败，则清理已创建的文件
    if (created) {
      try {
        await fs.remove(hooksDir);
      } catch (cleanupError) {
        console.error(chalk.red('清理失败的组件文件失败:'), cleanupError);
      }
    }
    throw error;
  }
};

// 更新入口文件
const updateComponentsEntry = async (hooksDir: string, folderName: string) => {
  const code = await fs.readFile(PATHS.hooksEntry, 'utf-8');

  // 解析现有的导入语句
  const importRegex = /import\s+(?:\w+|\{[^}]+\})\s+from\s+['"][^'"]+['"];?/g;
  const imports: string[] = code.match(importRegex) || [];

  // 添加新组件的导入
  const importStatement = `import ${folderName} from './${folderName}';`;

  if (!imports.includes(importStatement)) {
    imports.push(importStatement);
  }

  // 按字母排序
  imports.sort();

  // 替换原有 import 语句部分，写回 index.ts
  // 找到第一个非 import 行的位置
  const lines = code.split('\n');
  let firstNonImportIdx = lines.findIndex((line) => !/^import\s+/.test(line));
  if (firstNonImportIdx === -1) firstNonImportIdx = lines.length;
  let newCode = [...imports, ...lines.slice(firstNonImportIdx)].join('\n');

  // 自动维护 export { ... } 部分
  // 1. 收集所有 import xxx from './xxx'
  const importNames = imports
    .map((line) => {
      const match = line.match(/import\s+(\w+)\s+from/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  // 2. 生成新的 export 语句
  const exportBlock = ['export {', ...importNames.sort().map((name) => `  ${name},`), '};'].join('\n');

  // 3. 替换原有 export { ... } 块
  const exportRegex = /export\s*\{[\s\S]*?\};/m;
  if (exportRegex.test(newCode)) {
    newCode = newCode.replace(exportRegex, exportBlock);
  } else {
    // 没有 export 块则追加到末尾
    newCode = newCode + '\n' + exportBlock;
  }

  // 4. 格式化并写入
  await fs.writeFile(PATHS.hooksEntry, await formatCode(newCode, 'index.ts'));
};

/**
 * 复制文件
 * @param {string} hooksDir - 源目录
 * @param {string} name - 文件名
 *
 **/

const copyFileDoc = async (hooksDir, name) => {
  const sourceDir = hooksDir;
  const targetDir = join('docs', name);

  // 确保目标目录存在
  await fs.ensureDir(targetDir);

  // 复制目录内容，排除 index.ts
  const exclusions = ['index.ts', 'meta.json', '__tests__'];
  await fs.copy(sourceDir, targetDir, {
    filter: (src) => {
      // 遍历排除列表，检查文件路径是否匹配其中任何一个
      for (const exclusion of exclusions) {
        if (src.endsWith(exclusion) || src.includes(exclusion + '/')) {
          return false; // 匹配到排除项，过滤该文件
        }
      }
      return true; // 没有匹配到排除项，保留该文件
    },
  });
};

export const deleteHooks = async (name: string) => {
  const spinner = ora('正在删除 hooks...').start();
  const hookDir = resolve(PATHS.hooks, name);

  try {
    // 1. 删除组件目录
    await fs.remove(hookDir);

    // 2. 更新入口文件，移除该 hooks 的导出
    await removeFromHooksEntry(name);

    // 3. 更新 docs 目录
    await removeFromDocsEntry(name);

    spinner.succeed(`hooks${chalk.green(`${name} 删除成功！`)}`);
  } catch (error) {
    spinner.fail(`hooks${chalk.red(` ${name} 删除失败`)}`);
    throw error;
  }
};

// 从入口目录移除  packages\hooks\src\index.ts
const removeFromHooksEntry = async (name: string) => {
  try {
    let content = await fs.readFile(PATHS.hooksEntry, 'utf-8');
    const lines = content.split('\n');
    const filteredLines = lines.filter((line) => !line.includes(`${name}`));

    content = filteredLines.join('\n');
    if (content.endsWith('\n\n')) {
      content = content.slice(0, -1);
    }

    await fs.writeFile(PATHS.hooksEntry, await formatCode(content));
  } catch (error) {
    console.error(chalk.red('移除入口文件失败:'), error);
    throw error;
  }
};

// 从 docs 目录移除
const removeFromDocsEntry = async (name) => {
  const docsDir = resolve(PATHS.docsDir, name);
  try {
    await fs.remove(docsDir);
    await updateCreateRouterFile(name, 'delete');
  } catch (error) {
    console.error(chalk.red(`${PATHS.docsDir}目录下删除 ${name} 目录失败:`), error);
    throw error;
  }
};
