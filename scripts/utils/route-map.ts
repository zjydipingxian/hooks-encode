// 路由映射关系。 用于输入文件目录，以及选择归类的时候，自动创建路由关系
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs-extra';
import { join, resolve } from 'path';
import _generate from '@babel/generator';
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';
import { format, resolveConfig } from 'prettier';

import { PATHS } from './paths';

const docsDir = PATHS.docsDir;
const traverse = _traverse.default;
const generate = _generate.default;

/**
 * 更新路由文件 (generate-router.js)，支持添加或删除 hook
 * @param hookName -
 * @param action - 'add' or 'delete'.
 * @param hooksType -
 */
export async function updateCreateRouterFile(folderName: string, action: 'add' | 'delete', hooksType?: string) {
  const actionText = action === 'add' ? '添加' : '删除';

  const spinner = ora().start(
    `${docsDir}目录下， ${chalk.cyan('generate-router.js')}... (${actionText} ${chalk.yellow(folderName)})`,
  );

  const routerFilePath = join(docsDir, '.vitepress', 'generate-router.js');

  // 读取现有的 Router.js 文件内容
  if (await fs.exists(routerFilePath)) {
    const routerContent = fs.readFileSync(routerFilePath, 'utf8');
    // 解析代码为 AST
    const ast = parser.parse(routerContent, { sourceType: 'module' });

    traverse(ast, {
      ObjectExpression(path) {
        if (action === 'add') {
          // 检查是否存在目标属性
          const targetProp = path.node.properties.find((prop) => prop.key.name === hooksType);
          if (targetProp) {
            targetProp.value.elements.push(t.stringLiteral(folderName));
            // 然后对数组中的所有元素进行排序
            targetProp.value.elements.sort((a, b) => a.value.localeCompare(b.value));
          } else {
            // 如果不存在，则添加新属性
            path.node.properties.push(
              t.objectProperty(t.identifier(hooksType!), t.arrayExpression([t.stringLiteral(folderName)])),
            );
          }
        } else if (action === 'delete') {
          // 删除逻辑：遍历所有分类，找到并移除指定的 hook
          path.node.properties.forEach((prop) => {
            if (t.isObjectProperty(prop) && t.isArrayExpression(prop.value)) {
              prop.value.elements = prop.value.elements.filter((elem) => !t.isStringLiteral(elem) || elem.value !== folderName);
            }
          });
        }
      },
    });

    // 生成新的代码
    const { code } = generate(ast, {}, routerFilePath);

    const options = await resolveConfig(PATHS.prettierConfig);

    // 使用 Prettier 格式化代码
    const formattedCode = await format(code, { parser: 'babel', ...options });

    // 写回文件
    await fs.writeFile(routerFilePath, formattedCode, 'utf8');

    resolve(code);
  }
  spinner.succeed(
    `${docsDir}目录下， ${chalk.green('generate-router.js')} 更新成功. (${actionText} ${chalk.yellow(folderName)})`,
  );
}
