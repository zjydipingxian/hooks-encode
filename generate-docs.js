const fs = require('fs');
const path = require('path');

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
    const docPath = path.join(docsDir, packageName);

    if (fs.existsSync(readmePath)) {
      if (!fs.existsSync(docPath)) {
        fs.mkdirSync(docPath, { recursive: true });
      }
      // fs.copyFileSync(readmePath, path.join(docPath, `${packageName}.md`));
    }
  }
});
