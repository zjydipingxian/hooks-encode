import { packagesDir } from './util.mjs';
import { join } from 'path';
import fs from 'fs-extra';
import _generate from '@babel/generator';
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';
import { object as render } from 'json-templater';
import { EOL } from 'os';

const traverse = _traverse.default;
const generate = _generate.default;

var IMPORT_TEMPLATE = "import {{name}} from './{{name}}';";
var MAIN_TEMPLATE = `
{{imports}}

export{
{{exports}}
}
`;

var includeHooksTemplate = [];
/**
 * @param {Array} packagesDir  包的名字，
 * @param {String} name 新加的包名
 * @param {Object} ctx  上下文
 */
export function buildEntry(packagesDir) {
  packagesDir.forEach((dir) => {
    // 需要被 import 进去的模板
    includeHooksTemplate.push(
      render(IMPORT_TEMPLATE, {
        name: dir,
      }),
    );
  });

  const template = render(MAIN_TEMPLATE, {
    imports: includeHooksTemplate.join(EOL),
    exports: packagesDir.map((v) => `  ${v}`).join(',' + EOL),
  });

  return template;
}

const indexFile = join(packagesDir, 'index.ts');
// ast 方式 注入 import 以及  export
export const buildImportExport = async (dir, packageName) => {
  new Promise((resolve, reject) => {
    let code = fs.readFileSync(indexFile, 'utf-8');

    // 解析成 AST
    const ast = parser.parse(code, {
      sourceType: 'module',
    });

    // 检查是否已经存在 import 语句
    const importExists = ast.program.body.some((node) => t.isImportDeclaration(node) && node.source.value === `./${packageName}`);

    // 检查是否已经存在 export 语句
    const exportExists = ast.program.body.some(
      (node) => t.isExportNamedDeclaration(node) && node.specifiers.some((specifier) => specifier.exported.name === packageName),
    );

    if (!importExists) {
      const importDeclaration = t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier(packageName))],
        t.stringLiteral(`./${packageName}`),
      );
      ast.program.body.push(importDeclaration);
    }

    if (!exportExists) {
      // export
      const exportDeclaration = t.exportNamedDeclaration(null, [
        t.exportSpecifier(t.identifier(packageName), t.identifier(packageName)),
      ]);
      ast.program.body.push(exportDeclaration);
    }

    // 合并 export 语句
    const exportSpecifiers = [];
    ast.program.body = ast.program.body.filter((node) => {
      if (t.isExportNamedDeclaration(node)) {
        exportSpecifiers.push(...node.specifiers);
        return false;
      }
      return true;
    });

    if (exportSpecifiers.length > 0) {
      const combinedExportDeclaration = t.exportNamedDeclaration(null, exportSpecifiers);
      ast.program.body.push(combinedExportDeclaration);
    }

    // 生成新的代码
    const output = generate(ast, {}, code);

    const formattedCode = output.code.replace(/export \{([^}]+)\}/g, (match, p1) => {
      const exports = p1
        .split(',')
        .map((e) => e.trim())
        .join(`,${EOL}  `);
      return `export {${EOL}  ${exports}${EOL}}`;
    });

    // 写回 index.js 文件
    fs.writeFileSync(indexFile, formattedCode);

    resolve(true);
  });
};
