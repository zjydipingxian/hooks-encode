import commonJS from '@rollup/plugin-commonjs'; // 查找和打包node_modules中的第三方模块
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve'; // 查找和打包node_modules中的第三方模
import typescript from '@rollup/plugin-typescript'; // 解析TypeScript
import { babel, getBabelOutputPlugin } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// 获取当前模块的URL
const __filename = fileURLToPath(import.meta.url);
// 提取目录名
const __dirname = path.dirname(__filename);
const pkgPath = path.resolve(__dirname, 'package.json');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const external = ['vue', 'tslib', 'Vue'];

const tsPlugins = [
  json({
    namedExports: false,
  }),
  nodeResolve(), // 允许你使用 'import' 语句来导入
  commonJS(), // 允许你导入 CommonJS 模块
  babel({ babelHelpers: 'bundled' }),
  terser(),
];

// ES 模块构建配置
const esConfig = {
  external,
  input: 'src/index.ts', // 输入文件
  output: {
    dir: 'es', // 输出目录
    format: 'es', // 输出格式为ES模块
    preserveModules: true, // 保留模块结构
    preserveModulesRoot: 'src', // 保留模块根目录
    exports: 'named', // 导出方式
  },
  plugins: [
    ...tsPlugins,
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      declaration: true, // 启用声明文件的生成
      declarationDir: 'es', // 指定声明文件的输出目录
      outDir: 'es',
    }),
  ],
};

// CommonJS 模块构建配置
const cjsConfig = {
  external,
  input: 'src/index.ts', // 输入文件
  output: {
    dir: 'lib', // 输出目录
    format: 'cjs', // 输出格式为ES模块
    preserveModules: true, // 保留模块结构
    preserveModulesRoot: 'src', // 保留模块根目录
    exports: 'auto', // 导出方式
  },
  plugins: [
    ...tsPlugins,
    getBabelOutputPlugin({ presets: ['@babel/preset-env'] }),
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      declaration: true, // 启用声明文件的生成
      declarationDir: 'lib', // 指定声明文件的输出目录
      outDir: 'lib',
    }),
  ],
};

// umd 模块构建配置
const umdConfig = {
  external: ['vue'],
  input: 'src/index.ts', // 输入文件
  output: {
    file: `dist/${pkg.name}.js`, // 输出目录
    format: 'umd', // 输出格式为ES模块
    name: pkg.name,
    globals: {
      vue: 'Vue',
    },
  },
  plugins: [
    ...tsPlugins,
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      declaration: false, // 启用声明文件的生成
    }),
  ],
};

export default [esConfig, cjsConfig, umdConfig];
