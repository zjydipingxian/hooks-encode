import { rollup } from 'rollup';
import { fileURLToPath } from 'url';
import config from '../rollup.config.mjs';
import fs from 'fs';
import path from 'path';

// 获取当前模块的URL
const __filename = fileURLToPath(import.meta.url);
// 提取目录名
const __dirname = path.dirname(__filename);

const cleanOutput = () => {
  const dirs = ['lib', 'es', 'dist'];
  dirs.forEach((dir) => {
    const dirPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  });
};
cleanOutput();

// 构建
(async () => {
  try {
    // 使用 Rollup 的 rollup 函数构建项目
    const bundles = await Promise.all(
      config.map(async (cfg) => {
        const bundle = await rollup(cfg);
        await bundle.write(cfg.output);
        // 清理 bundle 对象，释放资源
        await bundle.close();
      }),
    );

    console.log('Build completed 成功.');
  } catch (error) {
    console.log('🚀 ~ error:', error);
  }
})();
