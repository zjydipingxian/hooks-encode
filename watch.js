const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

const templates = path.resolve(process.cwd(), './packages/hooks/src/**/');
// 获取 docs 下的文件目录地址
const docsDir = path.resolve(__dirname, 'docs');

let watcher = chokidar.watch([templates], {
  persistent: true,
  ignored: [path.join(templates, '/index.ts'), path.join(templates, '/router.js')],
});

watcher.on('ready', function () {
  // 添加
  watcher.on('add', function (filePath) {
    syncFile(filePath, 'add');
  });

  // 改变
  watcher.on('change', function (filePath) {
    syncFile(filePath, 'change');
  });

  // 删除
  watcher.on('unlink', function (filePath) {
    syncFile(filePath, 'unlink');
  });
});

function exec(cmd) {
  return require('child_process').execSync(cmd).toString().trim();
}

// 文件的增删查改
function syncFile(filePath, action) {
  const relativePath = path.relative(path.resolve(process.cwd(), './packages/hooks/src'), filePath);

  // meta.json 不处理 但处理其他事情 比如 修改 里面的type内容时候， 要更新 generate-router.js的东西
  if (relativePath.indexOf('meta.json') > -1) {
    return;
  }

  const targetPath = path.join(docsDir, relativePath);
  if (action === 'add' || action === 'change') {
    fs.copyFileSync(filePath, targetPath);
  }

  if (action === 'unlink') {
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
  }
}
