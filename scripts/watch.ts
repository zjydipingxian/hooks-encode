import { resolve, join, basename, dirname, relative } from 'path';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import _generate from '@babel/generator';
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';
import { PATHS } from './utils';

const traverse = _traverse.default;
const generate = _generate.default;

const templates = resolve(PATHS.hooks, '**/*');

const routerFilePath = resolve(PATHS.docsDir, '.vitepress/generate-router.js');
console.log('🚀 ~ routerFilePath:', routerFilePath);

const watcher = chokidar.watch([templates], {
  persistent: true,
  ignored: [join(templates, '/index.ts'), join(templates, '/router.js'), join(templates, '/**/__tests__/**')],
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 50,
  },
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
  const relativePath = relative(PATHS.hooks, filePath);

  // meta.json 不处理 但处理其他事情 比如 修改 里面的type内容时候， 要更新 docs/.vitepress/generate-router.js的东西
  if (relativePath.indexOf('meta.json') > -1) {
    if (action === 'add') {
      setTimeout(() => {
        handleMetaJsonChange(filePath);
      }, 200); // 给文件系统更多时间完成写入
    } else {
      handleMetaJsonChange(filePath);
    }
    return;
  }

  const targetPath = join(PATHS.docsDir, relativePath);
  if (action === 'add' || action === 'change') {
    fs.copyFileSync(filePath, targetPath);
  }

  if (action === 'unlink') {
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      // 检查文件夹是否为空
      checkAndRemoveEmptyDirectory(dirname(targetPath));
    }
  }
}

// 操作 meta.json 对 router.js 做处理
// 在 handleMetaJsonChange 函数中添加错误处理
// 操作 meta.json 对 router.js 做处理
async function handleMetaJsonChange(filePath) {
  try {
    // 更稳健地等待文件准备好
    const meta = await readJsonWithRetry(filePath, 3000);
    if (!meta) {
      console.warn(`Failed to read valid JSON from ${filePath} after retries`);
      return;
    }

    // 获取 hooks 的名称
    const hookName = basename(dirname(filePath));

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
  } catch (error) {
    console.error('Error handling meta.json change:', error);
  }
}

// 带重试机制的 JSON 读取函数
async function readJsonWithRetry(filePath: string, timeout: number): Promise<any> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      // 检查文件是否存在
      await fs.access(filePath, fs.constants.R_OK);

      // 尝试读取并解析 JSON
      const content = await fs.readFile(filePath, 'utf-8');
      if (content.trim() === '') {
        // 文件为空，继续等待
        await new Promise((resolve) => setTimeout(resolve, 100));
        continue;
      }

      return JSON.parse(content);
    } catch (error) {
      // 如果是文件不存在错误，继续等待
      if (error.code === 'ENOENT') {
        await new Promise((resolve) => setTimeout(resolve, 100));
        continue;
      }

      // 如果是JSON解析错误，也继续等待文件写入完成
      if (error instanceof SyntaxError) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        continue;
      }

      // 其他错误直接抛出
      throw error;
    }
  }

  // 超时后仍然失败，记录最后的错误
  return null;
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
