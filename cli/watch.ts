import path from 'path';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import _generate from '@babel/generator';
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';
import { __dirname } from './util.ts';

const traverse = _traverse.default;
const generate = _generate.default;

const templates = path.resolve(process.cwd(), './packages/hooks/src/**/');
// 获取 docs 下的文件目录地址
const docsDir = path.resolve(__dirname, '../docs');

const routerFilePath = path.resolve(docsDir, '.vitepress/generate-router.js');

const watcher = chokidar.watch([templates], {
  persistent: true,
  ignored: [path.join(templates, '/index.ts'), path.join(templates, '/router.js'), path.join(templates, '/**/__tests__/**')],
});

watcher.on('ready', function () {
  // 添加
  watcher.on('add', function (filePath) {
    console.log('add', filePath);
    syncFile(filePath, 'add');
  });

  // 改变
  watcher.on('change', function (filePath) {
    console.log('change', filePath);
    syncFile(filePath, 'change');
  });

  // 删除
  watcher.on('unlink', function (filePath) {
    console.log('unlink', filePath);
    syncFile(filePath, 'unlink');
  });
});

// 文件的增删查改
function syncFile(filePath, action) {
  const relativePath = path.relative(path.resolve(process.cwd(), './packages/hooks/src'), filePath);

  // meta.json 不处理 但处理其他事情 比如 修改 里面的type内容时候， 要更新 docs/.vitepress/generate-router.js的东西
  if (relativePath.indexOf('meta.json') > -1) {
    handleMetaJsonChange(filePath);
    return;
  }

  const targetPath = path.join(docsDir, relativePath);
  if (action === 'add' || action === 'change') {
    fs.copyFileSync(filePath, targetPath);
  }

  if (action === 'unlink') {
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      // 检查文件夹是否为空
      checkAndRemoveEmptyDirectory(path.dirname(targetPath));
    }
  }
}

// 操作 meta.json 对 router.js 做处理
async function handleMetaJsonChange(filePath) {
  // 获取 meta.json
  const meta = fs.readJsonSync(filePath);
  // 获取 hooks 的名称
  const hookName = path.basename(path.dirname(filePath));

  // 获取 ast
  const code = await fs.readFile(routerFilePath, 'utf-8');
  const ast = parser.parse(code, { sourceType: 'module' });

  traverse(ast, {
    VariableDeclarator(path) {
      // 解析 ast 拿到里面的 Router
      if (t.isIdentifier(path.node.id, { name: 'Router' })) {
        const properties = path.node.init.properties;

        // 移除旧的类型
        properties.forEach((prop) => {
          if (t.isArrayExpression(prop.value)) {
            prop.value.elements = prop.value.elements.filter((el) => !t.isStringLiteral(el, { value: hookName }));
          }
        });

        // 添加到新的类型
        let newTypeProp = properties.find((prop) => t.isIdentifier(prop.key, { name: meta.type }));
        console.log('🚀 ~ VariableDeclarator ~ newTypeProp:', newTypeProp);

        if (!newTypeProp) {
          newTypeProp = t.objectProperty(t.identifier(meta.type), t.arrayExpression([]));
          properties.push(newTypeProp);
        }

        newTypeProp.value.elements.push(t.stringLiteral(hookName));

        // 对每个类型的数组进行字母排序
        properties.forEach((prop) => {
          if (t.isArrayExpression(prop.value)) {
            prop.value.elements.sort((a, b) => a.value.localeCompare(b.value));
          }
        });
      }
    },
  });

  const output = generate(ast, {}, code);
  console.log('🚀 ~ handleMetaJsonChange ~ output:', output);
  await fs.writeFile(routerFilePath, output.code, 'utf-8');
}

function checkAndRemoveEmptyDirectory(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) throw err;

    // 如果文件夹为空，则删除
    if (files.length === 0) {
      fs.rmdir(dirPath, (err) => {
        if (err) throw err;
        console.log(`Directory ${dirPath} has been removed.`);
      });
    }
  });
}
