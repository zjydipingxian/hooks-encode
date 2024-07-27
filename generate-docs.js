const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// 获取 packages 下的文件目录地址
const packagesDir = path.resolve(__dirname, 'packages/hooks/src');
// 获取 docs 下的文件目录地址
const docsDir = path.resolve(__dirname, 'docs');

fs.readdirSync(packagesDir).forEach((packageName) => {
  // 获取每个 hooks 文件夹
  const packagePath = path.join(packagesDir, packageName);

  // 只要文件夹 如  useBoolean  useToggle
  if (fs.statSync(packagePath).isDirectory()) {
    // 获取每个 hooks 文件夹下面的 index.md 内容
    const readmePath = path.join(packagePath, 'index.md');

    if (fs.existsSync(readmePath)) {
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }
      fs.copyFileSync(readmePath, path.join(docsDir, `${packageName}.md`));
    }
  }
});

// 当前目录
// chokidar.watch('packages/hooks/src/**/index.md').on('all', (event, path) => {
//   console.log('🚀 ~ chokidar.watch ~ event, path:', event, path);
// });
