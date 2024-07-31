// 路由映射关系。 用于输入文件目录，以及选择归类的时候，自动创建路由关系
import fs from 'fs-extra';
import { join, resolve } from 'path';
import _generate from '@babel/generator';
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';
import { __dirname } from './util.mjs';

const traverse = _traverse.default;
const generate = _generate.default;
const docsDir = resolve(__dirname, '../docs');
export async function updateCreateRouterFile(hooksType, folderName) {
  return new Promise((resolve, reject) => {
    const routerFilePath = join(docsDir, '.vitepress', 'generate-router.js');

    // 读取现有的 Router.js 文件内容
    if (fs.existsSync(routerFilePath)) {
      const routerContent = fs.readFileSync(routerFilePath, 'utf8');
      // 解析代码为 AST
      const ast = parser.parse(routerContent, { sourceType: 'module' });

      traverse(ast, {
        ObjectExpression(path) {
          // 检查是否存在目标属性
          const targetProp = path.node.properties.find((prop) => prop.key.name === hooksType);
          if (targetProp) {
            targetProp.value.elements.push(t.stringLiteral(folderName));
          } else {
            // 如果不存在，则添加新属性
            path.node.properties.push(
              t.objectProperty(t.identifier(hooksType), t.arrayExpression([t.stringLiteral(folderName)])),
            );
          }
        },
      });

      // 生成新的代码
      const { code } = generate(ast, {}, routerFilePath);

      // 写回文件
      fs.writeFileSync(routerFilePath, code, 'utf8');

      resolve(code);
    }
  });
}
